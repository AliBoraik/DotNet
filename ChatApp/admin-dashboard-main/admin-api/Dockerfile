FROM node:12.20.0-alpine
WORKDIR /core
ENV PATH /app/node_modules/.bin:$PATH
COPY . .
RUN yarn install
RUN yarn run
CMD ["yarn", "start"]
