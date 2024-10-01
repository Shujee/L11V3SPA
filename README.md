# L11V3SPA
Base repository with Laravel 11 as server and Vuetify 3 as SPA client. Also contains DockerFile to create a container that runs Apache, PHP, XDebug and other necessary tools for local development and debugging. On the server-side, Sanctum is used for cookie-based authentication. On the client-side, axios keeps track
of managing the cookie and refreshing it automatically.

# How to use
1. Fork the repository.
2. Clone the forked repo to your machine.
3. Make sure you have Docker installed on your machine. If you're using Visual Studio Code, it is nice to have Docker extension installed.
4. Open forked repo in VSCode (or whatever IDE you use).
5. Open `/docker/.env` file in the editor and update Docker variables such as the port number you want your Laravel server to run on.
6. Open `docker-compose.yml` and set the image name placeholder to whatever you want.
7. Open Terminal and go to `docker` subfolder.
8. Run `docker compose build` to create image.
9. Run `docker compose up` to create and run a container from the image.
10. A couple of certificate files (`.crt` and `.key`) will be generated and copied to `docker` folder on the HOST MACHINE. Install the `.crt` certificate on Host machine in `Trusted Root Certification Authorities` folder.
11. Open your server-domain in the browser and make sure the browser does not complain about the certificate.