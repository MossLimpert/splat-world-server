# Splat World Server Documentation

## Node code
### Client Side
### Server Side

## SQL Database

## Minio Object Storage
You shouldn't need to mess with this much, unless you are making new buckets, but if you do want to go and check it, here's some useful commands:

[`mc ls`](https://min.io/docs/minio/linux/reference/minio-mc/mc-ls.html)
This operates similar to `ls`, and it lists all of the minio buckets or objects in a current directory.

[`mc mb <bucket name>`](https://min.io/docs/minio/linux/reference/minio-mc/mc-mb.html)
This creates a Min.IO bucket.

[`mc rm <object name>`](https://min.io/docs/minio/linux/reference/minio-mc/mc-rm.html)
This removes objects in the current directory/bucket. 

## Linux Reference and SSH
### Local Testing Environment  

#### NPM scripts  
In gulpFile.js, you can find a couple scripts used to automate the building, linting, and watching files in nodemon.   

`jsTask`
jsTask takes the .jsx React files and runs them through webpack, which makes them smaller and more efficient. 

`lintTask`
lintTask runs all of our code through eslint, automatically modifying it where it can so that our code meets the Airbnb code linting standards. 

`build`
build runs jsTask and lintTask in parallel. 

`watch`
watch observes our files for changes, and then tells nodemon to restart the live running version of our code. 


#### SQL Server
To set up the local SQL Server, you need to install [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) and [MySQL](https://dev.mysql.com/downloads/mysql/). Once you've done that, you can create the schema/database splat_world, and use the [swdb.sql](server/sql/swdb.sql) file to set up the tables. I recommend using [W3School's MySQL reference](https://www.w3schools.com/mysql/) because it makes more sense than the actual MySQL documentation. Your SQL database starts up when your computer starts up, so you never have to worry about starting it up before running your local code.

#### Minio Object Storage
Min.IO on the other hand, will need to be run before you start testing your code, otherwise your code will not be able to interact with it. Inside of your Windows Subsystem for Linux (WSL)-- or other Linux virtual machine or what have you-- you will need to [install Min.IO](https://min.io/docs/minio/linux/operations/install-deploy-manage/deploy-minio-single-node-single-drive.html#minio-snsd) and [the command line client (cli)](https://min.io/docs/minio/linux/reference/minio-mc.html). When you install the cli, you'll need to hook it up to your $PATH, so that linux knows where to look for the commands and what to do. Moss hasn't had luck doing this the way they have it:
```
curl https://dl.min.io/client/mc/release/linux-amd64/mc \
  --create-dirs \
  -o $HOME/minio-binaries/mc

chmod +x $HOME/minio-binaries/mc
export PATH=$PATH:$HOME/minio-binaries/

mc --help
```
You run the first command, of course, to get the client and create the directory and put it in there, but the chmod and export PATH only seem to work for the session you have that shell open, although, this is when running on WSL, so Moss thinks if you're running in a normal linux virtual machine (vm) or an actual linux distro, you shouldn't have this problem. You could also run it on your windows os or mac os, but you'll be using the linux version if you are ever interacting with the server that runs our object storage, so keep that in mind. 
There is a fix to get this to work, you have to edit the .bashrc file in your ~/HOME directory. Moss found the solution [here](https://stackoverflow.com/questions/66305717/adding-path-variable-in-wsl).

### Capsul Server
We host our Node server on [Capsul](https://capsul.org/), a small, worker-owned server hosting org. In order to push the latest server code to the live server, you'll need to [SSH into it](https://github.com/MossLimpert/splat-world-server?tab=readme-ov-file#linux-reference-and-ssh). 
When you get in, you'll be in the ~/HOME directory by default. You need to pull from git on your end, so use the change directory command to go into the /splat-world-server folder.
`cd splat-world-server/`

Once you're there, `git pull` in order to update all the source code that our server uses to build the application. If you're unfamiliar with using git from the command line, [the official reference docs are well written and make a lot of sense!](https://git-scm.com/docs) 

Now, the live code doesn't update right away, ~~we're not running the live build with nodemon, that's only for testing~~ that's a lie we are for now but that will change. Instead, it is run the normal way, but it's inside of a Docker container. What's Docker?

#### Docker
I'm so glad you asked. Docker basically runs little vms inside our server, these are called Docker containers. You can find the Docker documentation [here](https://docs.docker.com/reference/). There is one for the MySQL database, and one for the Node server. 

`splatweb` this is the name of our Node server
`db` this the name of our MySQL database

If you're still inside the splat-world-server/ directory, you can use the command:

`docker build .`
This builds a Docker container out of the current code in the directory you're in. It knows what settings to use because of the Dockerfile you can find at the top level of the repository. You'll see output that looks like this:
![Image is of a CLI with the following text visible: blurred text ~/splat-world-server main> docker build .
DEPRECATED: The legacy builder is deprecated and will be removed in a future release.
            Install the buildx component to build images with BuildKit:
            https://docs.docker.com/go/buildx/
there is an arrow pointing to the above text after DEPRECATED. it says: "we don't have to worry about this now"
Sending build context to Docker daemon  195.2MB
Step 1/6 : FROM node:20
 ---> b5288ff94366
Step 2/6 : WORKDIR /usr/src/app
 ---> Using cache
 ---> 58972d94b3e8
Step 3/6 : COPY package*.json ./
 ---> Using cache
 ---> 8c371d17bc83
Step 4/6 : RUN npm install
 ---> Using cache
 ---> 1ac708ec12f0
Step 5/6 : COPY . .
 ---> Using cache
 ---> 38ae7cf545af
Step 6/6 : CMD npm run start
 ---> Using cache
 ---> c14267408049
Successfully built c14267408049 there is a box around this last bit of text](readme/docker1.png)

`docker tag splatwebserver:dev <insert boxed text here>`
This command associates the build you just made with the container we are running the Node server from. 

`docker-compose -f /data/docker-compose.yml up -d --force-recreate splatweb`
This command recreates the docker container. The flag `-f` tells docker-compose where the docker compose file is. This is different from the Dockerfile, because it configures all of the docker containers, and holds environment variables for each one, if need be. `up` tells Docker that we want to recreate the container from scratch. `-d` runs the container in the background, that way you can go back to entering commands after you restart it. `--force-recreate` tells Docker to recreate it, even if it doesn't seem like it's changed at all. `splatweb` is the name of the container.

These are the main three commands you need to recreate containers after you upload a new build. 

Here are some other useful commands:

`docker exec -it <container name> bash`
This opens a bash terminal to whichever container you specify. 

### MAGIC Server

Magic Spell Studios gave us a server, but it runs on RIT's private network, and can only be accessed from RIT wifi. But I was able to convince CAD to make an exception, and so it talks to our Node server only. The MAGIC Server hosts our Min.IO object storage. Eventually, when we graduate, Moss will migrate it and its data over to the Capsul server, inside of another Docker container. [Find useful commands in the Min.IO section]()
