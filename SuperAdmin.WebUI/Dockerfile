FROM mcr.microsoft.com/dotnet/aspnet:3.1-focal AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

ENV ASPNETCORE_URLS=http://+:80

FROM mcr.microsoft.com/dotnet/sdk:3.1-focal AS build
WORKDIR /src
COPY ["SuperAdmin.WebUI/SuperAdmin.WebUI.csproj", "SuperAdmin.WebUI/"]
RUN dotnet restore "SuperAdmin.WebUI/SuperAdmin.WebUI.csproj"
COPY . .
WORKDIR "/src/SuperAdmin.WebUI"
RUN dotnet build "SuperAdmin.WebUI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SuperAdmin.WebUI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SuperAdmin.WebUI.dll"]
