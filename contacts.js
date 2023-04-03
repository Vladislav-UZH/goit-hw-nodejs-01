const chalk = require("chalk");
const { nanoid } = require("nanoid");
const path = require("path");
const fs = require("fs").promises;

const contactsPath = path.join(__dirname, "./db/contacts.json");
const encoding = "utf-8";
/** --READ_ALL_CONTACTS
 *
 * @returns [{id:string,name:string,email:string,phone:string}]
 */
const readContacts = async () => {
  try {
    const resp = await fs.readFile(contactsPath);
    const contacts = JSON.parse(resp);
    if (!contacts || !contacts.length) {
      return console.log(chalk.red("Failed! There are no contacts here!"));
    }
    return contacts;
  } catch (e) {
    console.error(e);
  }
};

/** --GET_ALL_CONTACTS--
 *
 * @returns contacts: [{id:string,name:string,email:string,phone:string}]
 */
const listContacts = async () => {
  try {
    const contacts = await readContacts();
    console.table(contacts);
    return contacts;
  } catch (e) {
    console.error(e);
  }
};

/** --GET_THE_CONTACT_BY_ID--
 * @param {string} id
 * @returns contact: {id:string,name:string,email:string,phone:string}
 */
const getContactById = async (id) => {
  try {
    const contacts = await readContacts();
    console.log("Start searching.. Please, wait!");
    const foundContact = contacts.find((contact) => id === contact.id);
    if (!foundContact) {
      console.log(
        chalk.red("Failed! There are no contacts to match your request!")
      );
      return;
    }
    console.log(
      chalk.green("Success! Found the contact that matches your request!")
    );
    console.log(foundContact);
    return foundContact;
  } catch (e) {
    console.error(e);
  }
};

/**--ADD_THE_CONTACT--
 *
 * @param  {string} name
 * @param {string} email
 * @param {string} phone
 * @returns contact : {id:string,name:string,email:string,phone:string};
 */
const addContact = async ({ name, email, phone }) => {
  try {
    const contacts = await readContacts();
    if (contacts.some((contact) => contact.phone === phone)) {
      console.log(
        chalk.red(
          `Failed! The entered phone: "${phone}" has been already in the contacts!`
        )
      );
    }
    const newContact = { id: nanoid(), name, email, phone };
    //
    console.log("Started adding your contact!");
    //
    contacts.push(newContact);
    const stringifiedUpdatedContacts = JSON.stringify(contacts);
    //
    await fs.writeFile(contactsPath, stringifiedUpdatedContacts, encoding);
    console.log(chalk.green(`Your contact has been successfully created!`));
    return;
  } catch (e) {
    console.error(e);
  }
};
/** --REMOVE_THE_CONTACT--
 *
 * @param {string} id
 * @returns void
 */
const removeContact = async (id) => {
  try {
    const contacts = await readContacts();
    console.log("Started deleting your contact!");
    const filtred = contacts.filter((contact) => contact.id !== id);
    if (contacts.length === filtred.length) {
      return console.log(
        chalk.red("Failed! There are no contacts to match your request!")
      );
    }

    const updatedContacts = JSON.stringify(filtred);
    await fs.writeFile(contactsPath, updatedContacts, encoding);
    console.log(chalk.green("Success! The contact has been deleted!"));
    return;
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
};
