const { argv } = require("yargs");
const {
  listContacts,
  addContact,
  removeContact,
  getContactById,
} = require("./contacts");
const invokeAction = ({ action, id, name, email, phone }) => {
  const contactData = { name, email, phone };
  switch (action) {
    case "list":
      listContacts();
      break;
    case "add":
      addContact(contactData);
      break;
    case "remove":
      removeContact(id);
      break;
    case "get":
      getContactById(id);
      break;
    default:
      break;
  }
};
invokeAction(argv);
