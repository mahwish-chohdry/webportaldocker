FROM mcr.microsoft.com/dotnet/aspnet:3.1-focal AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

ENV ASPNETCORE_URLS=http://+:80

FROM mcr.microsoft.com/dotnet/sdk:3.1-focal AS build
WORKDIR /src
COPY ["SuperAdmin.Models/SuperAdmin.Models.csproj", "SuperAdmin.Models/"]
RUN dotnet restore "SuperAdmin.Models/SuperAdmin.Models.csproj"
COPY . .
WORKDIR "/src/SuperAdmin.Models"
RUN dotnet build "SuperAdmin.Models.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SuperAdmin.Models.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SuperAdmin.Models.dll"]
