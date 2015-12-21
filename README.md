# bahnmap

Deutsche Bahn, the biggest German railway company, is currently rolling out
a new onboard app across its high-speed ICE fleet.

It comes with a map that lets you track your train's position in real-time,
and while that's neat, it wasn't good enough for me, so I hacked together
an improved version. It's a bit smoother, shows the current speed and
displays more than just the most recent data point.


## Installing

```sh
npm install
make
```


## Running

```sh
npm run serve
```

This will start a server on http://localhost:9090 that proxies requests
to the onboard server.


## Licence

[MIT](LICENSE.md)
