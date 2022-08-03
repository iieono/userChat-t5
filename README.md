https://userchat-t5.netlify.app/

### How it works
At the start user have to enter its name (just name without password or anything).
After entering its name user get to the “send a message” form: recipient, title and the message body.
Recipient field should support autocompletion — when the user starts entering name, dropdown is shown with the corresponding names (you have to use ready component for this).
Body field  is multiline text (textarea).
You have to use a CSS framework (Bootstrap is recommended, but you can choose any CSS framework).
Under “send a message” you have to display all messages send to the current user.
The application is akin to an e-mail application, not a chat.
All messages are stored in database forever. So, if somebody uses the same name, they will see all corresponding messages.
You can either implement auto-refresh every 5 seconds to catch new messages for the current user or — it’s better, but optional — use websockets to push new messages to the user.
Users can send message to themselves — so, do not write additional branch to remove current user from autocompletion, etc.
