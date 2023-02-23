import axios from "axios";

export const postAuth = (data: { username: string; password: string }) =>
  axios.post(
    "https://sideshow.loopbrasil.com/account/auth",
    { ...data, store: "revenda" },
    {
      headers: {
        Authorization:
          "Bearer JDJ5JDEwJDZ6NUt3WHFSTnhWbTU4aFg0Uk9OM3VyTHgueklQMXhwM21xRjFBa1VUaHFIRnRQRGZmMkE2",
      },
    }
  );
