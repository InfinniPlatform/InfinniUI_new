function ServerAction( parentView ) {
    _.superClass( ServerAction, this, parentView );

    this.provider = window.InfinniUI.providerRegister.build( 'ServerActionProvider' );

    this.updateContentTypeStrategy();
    this.on( 'change:contentType', this.updateContentTypeStrategy );
}

_.inherit( ServerAction, BaseAction );

_.extend( ServerAction.prototype, BaseFallibleActionMixin, {

    defaults: {
        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
        method: 'GET',
        data: {}
    },

    updateContentTypeStrategy: function() {
        var contentType = this.getProperty( 'contentType' );

        if( _.isString( contentType ) && contentType.includes( 'multipart' ) ) {
            this.contentTypeStrategy = serverActionContentTypeStrategy[ 'File' ];
        } else {
            this.contentTypeStrategy = serverActionContentTypeStrategy[ 'Object' ];
        }
    },

    execute: function( callback ) {
        var that = this;
        var onExecuted = function( args ) {
            that.onExecutedHandler( args );

            if( _.isFunction( callback ) ) {
                callback( args );
            }
        };
        var onSuccess = function( args ) {
            that.onSuccessHandler( args );
        };
        var onError = function( args ) {
            that.onErrorHandler( args );
        };

        this.contentTypeStrategy.run( this.provider, this._getRequestData(), onExecuted, onSuccess, onError );
    },

    setParam: function( name, value ) {
        this.setProperty( 'params.' + name, value );
    },

    getParam: function( name ) {
        return this.getProperty( 'params.' + name );
    },

    _getRequestData: function() {
        var origin = this._replaceParamsInStr( this.getProperty( 'origin' ) );
        var path = this._replaceParamsInStr( this.getProperty( 'path' ) );
        var method = this.getProperty( 'method' ).toUpperCase();
        var contentType = this.getProperty( 'contentType' );
        var data = this._replaceParamsInObject( this.getProperty( 'data' ) );
        var result = {};

        result.requestUrl = origin + path;
        result.method = method;
        result.contentType = contentType;

        if( !_.isEmpty( data ) ) {
            if( method == 'GET' ) {
                result.requestUrl = result.requestUrl + '?' + stringUtils.joinDataForQuery( data );
            } else {
                result.args = ( _.isString( contentType ) && contentType.includes( 'application/json' ) ) ? JSON.stringify( data ) : data;
            }
        }

        return result;
    },

    _replaceParamsInStr: function( str, escape ) {
        if( !str || !_.isString( str ) ) {
            return str;
        }

        var that = this;
        var matched = str.match( /^<%([\s\S]+?)%>$/ );

        if( matched ) {
            return this.getParam( matched[ 1 ] );
        }

        return str.replace( /<%([\s\S]+?)%>/g, function( p1, p2 ) {
            var val = that.getParam( p2 );

            if( escape && _.isString( val ) ) {
                val = val.replace( /"/g, '\\"' );
            }
            return val;
        } );
    },

    _compileData: function( data ) {
        var res;

        if( Array.isArray( data ) ) {
            res = Array.map( function( item ) {
                if( _.isObject( item ) || Array.isArray( item ) ) {
                    this._compileData( item );
                }
            }, this );
        } else if( _.isObject( data ) ) {
            res = {};
            Object.keys( data ).forEach( function( name ) {
                var parsedName = this._replaceParamsInStr( name );

                res[ parsedName ] = this._compileData( data[ name ] );
            }, this );
        } else {
            res = this._replaceParamsInStr( data, true );
        }

        return res;
    },
    _replaceParamsInObject: function( obj ) {
        if( _.isEmpty( obj ) ) {
            return obj;
        }


        return this._compileData( obj );
    }
} );

window.InfinniUI.ServerAction = ServerAction;
