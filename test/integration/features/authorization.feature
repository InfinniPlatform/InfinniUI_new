Функционал: Авторизация пользователей
  
Сценарий: Вход в систему
	Допустим я не авторизован в системе
	И я нахожусь на экране "SignInView"
    Если введу в поле "Login" значение "ivan@test.ru"
    И введу в поле "Password" значение "ivan@test.ru"
    И нажму кнопку "SignInButton"
    То система авторизует меня под пользователем "ivan@test.ru"
	И система отобразит экран "PersonalCabinet"