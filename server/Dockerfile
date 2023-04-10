FROM mcr.microsoft.com/dotnet/sdk:7.0 as build-env
WORKDIR /app
EXPOSE 80
EXPOSE 443

COPY *.csproj ./
RUN dotnet restore

COPY . ./

RUN dotnet publish -c Release -o publish

FROM mcr.microsoft.com/dotnet/sdk:7.0 as final-env
WORKDIR /app
COPY /server/Images /app/Images
COPY --from=build-env /app/publish .
ENTRYPOINT ["dotnet", "server.dll"]