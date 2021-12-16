dotnet build

cd src/ui/ng-alain
npm install && npm run-script build && del ..\..\liuliu.Bogs.Web\wwwroot\* /q && copy dist\* ..\..\liuliu.Bogs.Web\wwwroot\ && cd ..\..\liuliu.Bogs.Web && dotnet build -c Release && dotnet publish -c Release && cd ..\..\ && docker build -t liuliu.bogs.web .
