# phonetag

Vincent's current local IP is `10.244.11.108`. If he's hosting it, it should be at <http://10.244.11.108:5000>.

Enable [Chrome's "Treat insecure origin as secure" setting](chrome://flags/#unsafely-treat-insecure-origin-as-secure), add <http://10.244.11.108:5000> to the textbox, and relaunch Chrome for location tracking to work with `http` (until we verify the site with ssl).

## Running phonetag

Clone the repo and run `flask --app app.py run --host=0.0.0.0` in the `phonetag`directory. We're using the default Flask port, which is `5000` for the `https` connection.
