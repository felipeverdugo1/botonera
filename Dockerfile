# Usamos una imagen oficial y liviana de Node.js
FROM node:20-alpine

# Creamos y definimos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de dependencias primero para aprovechar el caché de Docker
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código de la aplicación
COPY . .

# Exponemos el puerto en el que corre tu app (ajústalo si usas otro)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]