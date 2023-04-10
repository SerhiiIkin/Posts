# Stage 1 - Build the React application
FROM node:18-alpine as client
WORKDIR /app
COPY ./client/package*.json ./
RUN npm install
COPY ./client .
RUN npm run build
RUN npm install -g vite
RUN npm install --production



# Stage 2 - Build the Web API
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS server
WORKDIR /app
COPY ./server/*.csproj ./
RUN dotnet restore
COPY ./server .
RUN dotnet publish -c Release -o publish

# Stage 3 - Combine the React application and the Web API
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY ./server/Images /app/Images
COPY --from=server /app/publish ./server
COPY --from=client /app/dist ./client
EXPOSE 80
ENTRYPOINT ["dotnet", "server/server.dll"]
