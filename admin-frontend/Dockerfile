# Etapa 1: Build-ul aplicației React
FROM node:18-alpine AS build

# Setează directorul de lucru
WORKDIR /app

# Copiază fișierele package.json și package-lock.json
COPY package*.json ./

# Instalează dependențele
RUN npm install --silent

# Copiază restul aplicației
COPY . .

# Build-uiește aplicația pentru producție
RUN npm run build

# Etapa 2: Servește aplicația cu Nginx
FROM nginx:alpine

# Copiază build-ul din etapa anterioară
COPY --from=build /app/build /usr/share/nginx/html

# Copiază configurația custom Nginx (opțional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expune portul 80
EXPOSE 80

# Pornește Nginx
CMD ["nginx", "-g", "daemon off;"]