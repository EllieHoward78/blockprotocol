import { createAuthenticatedHandler } from "../../lib/handler/authenticatedHandler";
import { SerializedUser } from "../../lib/model/user.model";

export default createAuthenticatedHandler<undefined, SerializedUser>().get(
  (req, res) => {
    const { user } = req;

    res.status(200).send(user.serialize());
  },
);
