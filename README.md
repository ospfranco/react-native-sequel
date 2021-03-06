# react-native-quick-sqlite

The **fastest** SQLite implementation for react-native.

## Motivation

This package is meant to be a (more or less) drop-in replacement for [react-native-sqlite-storage](https://github.com/andpor/react-native-sqlite-storage) and other libraries inspired by it (ex. [react-native-sqlite2](https://github.com/craftzdog/react-native-sqlite-2)).

Unlike previous implementations `quick-sqlite` uses [JSI bindings](https://formidable.com/blog/2019/jsi-jsc-part-2/), JSI removes almost all the overhead of intercommunication between JavaScript code and the native platform (using C++). This new bindings have an oversized impact on I/O tasks such as retrieving large amounts of data from disk, on my own testing I was able to retrieve **10k simple objects in between 120ms and 150ms on an iPhone X**.

It has also been **implemented from the ground up on C++**, which deals away with a lot of abstractions from the underlying OS, providing a single codebase, which ensures feature parity between the implementations.

## Before you start

### JSI bindings are not avaiable when connected to the chrome debugger

This is a limitation with JSI and the JavaScript engines implementing it, RN 0.64 completely dropped support for connecting to the chrome/firefox/safari debugger, from now on you should use [Flipper](https://github.com/facebook/flipper), it is actually quite nice, since there is no "debug" mode to turn on and you always run in the same engine as your application (JSC or Hermes).

### TODOs

There are some minor TODOs in the project
- **Everything is saved on the application's home folder**. I got lazy and ignore any passed path parameter, if you need this feel free to open a PR. 
- **When parsing the SQLite rows the strings are parsed as ASCII strings instead of UTF-8**, which will explode if you are using other languages. 

I have however ran out of time to fix this issues myself (and I'm a c++ noob), so please do submit a PR to fix this issues if you need them. Should be easy to do.

### The API is NOT 100% the same

Again, I've kinda run out of time, to implement the exact same API as [sqlite-storage](https://github.com/andpor/react-native-sqlite-storage). Namely, sqlite-storage returns an `item` function on the query result, it takes an index number and returns an object, I simply return an array, because creating deeply nested structures from the C++ code is somewhat cumbersome.

### Using TypeORM

The recommended way to use this package is to use [TypeORM](https://github.com/typeorm/typeorm) with [patch-package](https://github.com/ds300/patch-package). TypeORM already has a ReactNative Driver that hardcodes sqlite-storage. In the `example` project on the `patch` folder you can a find a [patch for TypeORM](https://github.com/ospfranco/react-native-quick-sqlite/blob/main/example/patches/typeorm%2B0.2.31.patch), it basically just replaces all the `react-native-sqlite-storage` strings in TypeORM with `react-native-quick-sqlite`, and does a tiny change for the way it accesses the resulting rows from the SQL execution.

If you want to directly access the low level methods check the section below.

## Installation and API

Install it with

```bash
yarn add react-native-quick-sqlite
```

If using TypeORM, follow the instructions on the TypeORM, the apply the patch file from the example project.

If not using TypeORM, the package exposes the following API:

```typescript
interface ISQLite {
  open: (dbName: string) => any;
  close: (dbName: string) => any;
  executeSql: (
    dbName: string,
    query: string,
    params: any[] | undefined
  ) => {
    rows: any[];
    insertId?: number;
  };
  // backgroundExecuteSql: (dbName: string, query: string, params: any[]) => any; // currently disabled, android was giving me some troubles
}

// It is globally available
declare var sqlite: ISQLite;
```

The JSI bindings expose this `sqlite` object in the global context, so you can directly call it from anywhere in the javascript context. The methods `throw` when an execution error happens, so `try ... catch` them.

## Contributing

PLEASE PLEASE DO CONTRIBUTE TO THE PROJECT, I DO NOT INTEND TO DEDICATE ALL OF MY TIME TO IT.

## Shameless Plugin

I'm available for consulting work!

If you or your company is in desperate need of increasing the speed of your react-native app, needs help with JSI bindings and/or in need of consulting in the latest technologies, feel free to [contact me](https://twitter.com/ospfranco), I'm available for freelance work.

## License

react-native-quick-sqlite is licensed under SSPL.
