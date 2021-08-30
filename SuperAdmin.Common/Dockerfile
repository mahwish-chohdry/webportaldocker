FROM mcr.microsoft.com/dotnet/aspnet:3.1-focal AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

ENV ASPNETCORE_URLS=http://+:80

FROM mcr.microsoft.com/dotnet/sdk:3.1-focal AS build
WORKDIR /src
COPY ["SuperAdmin.Common/SuperAdmin.Common.csproj", "SuperAdmin.Common/"]
RUN dotnet restore "SuperAdmin.Common/SuperAdmin.Common.csproj"
COPY . .
WORKDIR "/src/SuperAdmin.Common"
RUN dotnet build "SuperAdmin.Common.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SuperAdmin.Common.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SuperAdmin.Common.dll"]
