<p align="center">
    <img alt="Latitude55" src="https://res.cloudinary.com/latitude55/image/upload/v1634117961/logo-light.svg" width="210" />
</p>
<h1 align="center">
Task List
</h1>

# Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Summary](#summary)
- [Requirements](#requirements)
- [Getting started](#getting-started)
  - [Development](#development)
  - [Testing](#testing)
- [Collections](#collections)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Summary

Create a Tasks API which allows users to create tasks & task lists. A task can be added to one or more task lists.

## Requirements

- Develop an appropriate db schema & entities
- Develop a RestFul CRUD API with endpoints to allow users to add/remove a task & to add/remove a task from a task list

## Getting started

Requirements:

- Node: v18.x

> Info: If you have Volta installed, then it will manage this dependency for you.

### Development

```bash
npm i
cp .env.template .env
docker-compose up
npm run start
```

### Testing

To run the test suite you need to have the application running:

```bash
// Single run
npm run test

// Watch mode
npm run test:watch

// Code Coverage
npm run test:cov
```

## Collections

You can import the API into either [Insomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/) depending on your preference using the collections provided in the collections directory.
