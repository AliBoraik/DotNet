FROM node:13.12.0-alpine
WORKDIR /core
ENV PATH /app/node_modules/.bin:$PATH
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
