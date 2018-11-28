* Tutorial:
  - Based on:
    ASP.NET Core 2.0 & Angular 4: Build from Scratch a Web Application for Vehicles Management
	O.Nasri, 15 Dec 2017
	https://www.codeproject.com/Articles/1210559/Asp-net-core-Angular-Build-from-scratch-a-web-appl

* Completed project files:
  - Directory of C:\paul\proj\HelloAspNetCore
11/13/2018  01:40 PM           830,456 codeproject-demodotnetcore.zip  // Asp.Net Core: "demobackend"
11/13/2018  01:40 PM            94,522 codeproject-demoangular.zip  // Angular4: "demo"

* Steps for creating project from scratch:
  1. Create project:
     - dotnet --version
        <= 2.1.403
     - dotnet new mvc -au Individual -f netcoreapp2.1
        ... OR ...
     - MSVS 2017 > New > Project > C#, Type= ASP.Net Core Web App >
         Name= ManageCar, Template= API

  2. Edit code (initial):
     - MS Visual Code || MSVS:
         cd $PROJ/ManageCar
         code .
     - Startup.cs:
        <= Edit ConfigureServices(), Configure()
     - appsettings.js:
        <= Edit ConnectionStrings > DefaultConnection, set Log level= Trace {Default, Microsoft, System}
     - Controllers\
        <= Edit AccountController.cs; implement Register, Login, Logout; remove extraneous boilerplate
           Add ManageCarController.cs, implement REST apis {
             Get(), 
             Get(int id), 
             Post[FromBody] CarViewModel _car),
             Put(int id, [FromBody] CarViewModel value),
             Delete(int id)
     - Data\
        <= Add Car.cs

3. Create database:
   - MSVS Cmd prompt || MSVS > Package Manager Console >
       dotnet ef migrations add initialMigration -c ApplicationDbContext -v
       dotnet ef database update -c ApplicationDbContext -v
   - Verify DB (MSVS only):
       View > SQL Server Object Explorer > 
	     Databases > select correct LocalDB >
		 Tables > View/edit tables in selected LocalDB
   - NOTES:
     - "dotnet ef xxx" replaces old ASP.Net MVC/classic "Enable-Migrations" and "-Update-Database" commands
     - "LocalDb" written to Windows %USERPROFILE% directory, e.g. "c:\users\<myusername>\ManageCarDB.mdf"
     - "LocalDb" not supported on Linux (e.g. need mySql EF data provider instead)
	 
4. Add Automapper:
   - http://automapper.org/
   - MSVS *OR* MSVC:
     - Create Models\CarViewModel.cs
         <= Data\Car.cs is the model for EF; we should have a separate model for our REST API access
     - Create AutoMapperProfile\AutoMapperProfileConfiguration.cs 
         <= Auto-maps Car::CarViewModel
     - Edit Startup.cs, add IMapper server/service configuration
         <= Register, configure AutoMapperProfile\AutoMapperProfileConfiguration
   - Add Automapper to project:
       MSVS: PM> Install-Package AutoMapper => INSTALLED V8.0.0
	   Dotnet CLI: dotnet add package AutoMapper

5. Add Swagger:
   - https://github.com/domaindrivendev/Swashbuckle
   - Install-Package Swashbuckle.AspNetCore => INSTALLED V4.0.1
   - Edit Startup.cs, add Swagger server/service configuration
   
6. Test API:
   - MSVS Cmd prompt: dotnet run
        ... OR ...
     MSVS > F5 (Run/Debug)
   - http://localhost:5000/swagger
      <= View/exercise AccountManager (Login) and ManageCar directly

7. Add UI:
   - Ran into errors building Angular project, hacked simple HTML/jQuery UI instead
      <= Added wwwroot\{index.html, site.js}
   - Startup.cs:
      <= Must specify "app.UseStaticFiles();" in order to serve static content from wwwroot
   - Properties\launchSettings.json
      <= Changed root page to "http://localhost:5000/", to pick up index.html

---------------------------------------------------------------------------------------------------
11.27.18
--------
* Added Mysql support ("LocalDB" unsupported on Linux):
  1. Set ASPNETCOR_ENVIRONMENT (default environment == "Production")
       export ASPNETCORE_ENVIRONMENT=Linux 
	   
  2. Create mysql DB:
     - mysql -uroot -p*** mysql
	     create database ManageCarDb;
         grant all privileges on ManageCarDb.* to 'dotnetuser'@'localhost' identified by 'dotnetuser';
           <= The command is no longer "update user set password..." (!!!)
         flush privileges;
		 
  3. Added second, MySql connection string to appsettings.json:
       "ConnectionStrings": {
         "DefaultConnection": "Server=(LocalDb)\\MSSQLLocalDB;Database=ManageCarDB;Trusted_Connection=True;MultipleActiveResultSets=true",
         "mySqlConnection": "Server=localhost;port=3306;database=ManageCarDb;uid=dotnetuser;password=dotnetuser"
       },
	   
  4. Modified Startup.cs and ApplicationDbContext.cs to conditionally use one or the other DB connection:
     - Startup.cs:
         public void ConfigureServices(IServiceCollection services) {
            string env = System.Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            string connectionString;
            if (!string.IsNullOrEmpty(env) && env.Equals("Linux")) {
               connectionString = Configuration.GetConnectionString("mySqlConnection");
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseMySql(connectionString));
            } else {
                connectionString = Configuration.GetConnectionString("DefaultConnection");
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlServer(connectionString));
            }
			<= Similar code in ApplicationDbContext.cs...

  5. Import MySql data provider for MySql		
       dotnet add MySql.Data.EntityFrameworkCore =>
Successfully installed 'Google.Protobuf 3.5.1' to ManageCar
Successfully installed 'MySql.Data 8.0.13' to ManageCar
Successfully installed 'MySql.Data.EntityFrameworkCore 8.0.13' to ManageCar
Successfully installed 'System.Configuration.ConfigurationManager 4.4.1' to ManageCar
Successfully installed 'System.Security.Cryptography.ProtectedData 4.4.0' to ManageCar
	   
  6. Cleanup binaries, create new migration, build tables:
      export ASPNETCORE_ENVIRONMENT=Linux
      rm -rf obj/* bin/*
      <= Delete binaries
      dotnet restore
      <= Brings in NuGet packages  
      dotnet ef migrations remove --verbose =>
Table 'ManageCarDb.__EFMigrationsHistory' doesn't exist
      <= Similar error with "dotnet ef database update -v"
	     Oracle MySql driver for Asp.Net Core appears defective

  7. Removed Oracle library and installed "Pomelo.EntityFrameworkCore.MySql" instead:
       dotnet ef migrations list => NONE
       dotnet restore => OK
       dotnet ef migrations add linuxMigration -c ApplicationDbContext -v => OK
       dotnet ef database update -v => OK
       <= OK!  So we have ourselfs a database!
	   
		 

	 
  
  
  

	 
  