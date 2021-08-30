FROM mcr.microsoft.com/dotnet/aspnet:3.1-focal AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

ENV ASPNETCORE_URLS=http://+:80

FROM mcr.microsoft.com/dotnet/sdk:3.1-focal AS build
WORKDIR /src
COPY ["SuperAdmin.Services/SuperAdmin.Services.csproj", "SuperAdmin.Services/"]
RUN dotnet restore "SuperAdmin.Services/SuperAdmin.Services.csproj"
COPY . .
WORKDIR "/src/SuperAdmin.Services"
RUN dotnet build "SuperAdmin.Services.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SuperAdmin.Services.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SuperAdmin.Services.dll"]
