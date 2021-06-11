# Provotum Voter Application


* [General Information](#general-information)
* [Prerequisites](#prerequisites)
* [Development](#development)

## General Information

This repository contains one out of two major applications developed for my master thesis, the Voter application. It is a react native application designed for iOS (should also work on Android, just not tested). In this readme you will find information about the setup and development workflows for working with this code. 

## Prerequisites

I developed everything on a Macbook Pro with an M1 processor running BigSur 11.4. Through running it on an Apple Silicon Processor, some problems occurred with node versioning, so I had to fix my node version to **6.14.10**. This does not mean that you have to use the same version. However, it is the only one I tested throughout development. If you want to run this app on iOS you need a macOS-capable computer and an Emulator/iPhone running at least iOS version **10.0**.

## Development

### Only the Voter Application

If you are on a macOS device you may run the voter application locally through an iOS emulator for development. The script **development_voter_app.sh** will clone the repository for you. However, the complete setup is a bit more complicated for this than with the node applications. I strictly followed the setup and installation guide on the [React Native Website](https://reactnative.dev/docs/environment-setup). Make sure to select `macOS` as dev os and `iOS` as target os when going through the tutorial. 

If you have installed everything successfully, you may run the applications as such:

```bash
npx react-native run-ios --verbose
```

### A note on Android

React native theoretically should be able to deploy the application onto android devices or Emulators as well. However, I did not test this and you may need to provide *shims* and/or replacements for some elements when it comes to Android.

### Entire Provotum System

The easiest way to get started with Provotum development is to clone the [Infrastructure](https://github.com/provotum/provotum-infrastructure-claudio) repository. It contains a file called **development_setup.sh**, which will clone all the necessary repositories in the directory where it is executed and install all dependencies. Secondly, the script called **development_run.sh** will run all software pieces. 

**Note:** In order to run everything locally you need to have a running *mongodb* instance. The script will start everything as required. However, you need to install mongoDB on your system in advance. The script assumes that mongod has been installed through Homebrew. If that is not the case you will have to change the config location in the first line of the script.


The setup scrip will copy the configuration files in this repo into `.env` files in the respective repositories. Once this has been done in the initial setup, feel free to change ports, keys, etc. in the environment files.

