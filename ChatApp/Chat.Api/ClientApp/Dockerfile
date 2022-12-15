FROM node:14-alpine
WORKDIR /core
ENV PATH /app/node_modules/.bin:$PATH
COPY . .
RUN yarn install
RUN yarn run build
CMD ["yarn", "start"]
