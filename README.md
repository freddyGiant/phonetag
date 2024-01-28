# phonetag

Vincent's current local IP is `10.244.11.108`. If he's hosting it, it should be at <http://10.244.11.108:5000> (or <https://10.244.11.108:5000> if he gets the SSL certificates working).

## Running phonetag

Clone the repo and run `flask --app app.py run --host=0.0.0.0` in the `phonetag`directory. We're using the default Flask port, which is `5000` for the `https` connection.
