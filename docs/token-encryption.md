\# Token Encryption Plan



CanvasQuest allows users to connect their Canvas account by using an API token, since this allows access to assignment data, it must be handled securely

The token enters the system during the Canvas connect step, when a user submits their Canvas API token through the app.

The token will never be stored in plaintext, it will be encrypted before being written to the database.



Planned storage field:

\- `canvas\_tokens.encrypted\_token`



\## Key management

Encryption key will come from a variable:



\- `TOKEN\_ENCRYPTION\_KEY`



We must \*never\* commit this key to GitHub. It will only be stored in local `.env` files during development and secure environment settings.



\# What must never happen

\- logging the Canvas token

\- sending the token back to the client

\- storing the token unencrypted

\- hardcoding the encryption key



\## Planned implementation

The implementation is still a design-stage plan, but the current approach is:



\- use AES-GCM

\- use Node's built-in `crypto` module

\- perform encryption and decryption only on the server side





