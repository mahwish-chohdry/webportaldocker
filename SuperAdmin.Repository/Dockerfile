FROM mcr.microsoft.com/dotnet/aspnet:3.1-focal AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

ENV ASPNETCORE_URLS=http://+:80

FROM mcr.microsoft.com/dotnet/sdk:3.1-focal AS build
WORKDIR /src
COPY ["SuperAdmin.Repository/SuperAdmin.Repository.csproj", "SuperAdmin.Repository/"]
RUN dotnet restore "SuperAdmin.Repository/SuperAdmin.Repository.csproj"
COPY . .
WORKDIR "/src/SuperAdmin.Repository"
RUN dotnet build "SuperAdmin.Repository.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SuperAdmin.Repository.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SuperAdmin.Repository.dll"]
