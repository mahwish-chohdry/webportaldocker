FROM mcr.microsoft.com/dotnet/aspnet:3.1-focal AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

ENV ASPNETCORE_URLS=http://+:80

FROM mcr.microsoft.com/dotnet/sdk:3.1-focal AS build
WORKDIR /src
COPY ["SuperAdmin.BusinessLayer/SuperAdmin.BusinessLayer.csproj", "SuperAdmin.BusinessLayer/"]
RUN dotnet restore "SuperAdmin.BusinessLayer/SuperAdmin.BusinessLayer.csproj"
COPY . .
WORKDIR "/src/SuperAdmin.BusinessLayer"
RUN dotnet build "SuperAdmin.BusinessLayer.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SuperAdmin.BusinessLayer.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SuperAdmin.BusinessLayer.dll"]
