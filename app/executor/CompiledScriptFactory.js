function CompiledScriptFactory( scriptName, parentView ) {
    return {
        get: get
    };

    function get() {
        var scriptsStorage = parentView.getScriptsStorage();

        var script = scriptsStorage.getScripts().getById( scriptName );

        return script ? script.func : undefined;
    }
}
