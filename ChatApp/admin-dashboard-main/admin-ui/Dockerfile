# Node 16 base image
FROM node:16-alpine 
WORKDIR /app
COPY . .
RUN npm install  
# Build the app
RUN npm build
ENV NODE_ENV production
EXPOSE 2000
CMD [ "npm", "start"]