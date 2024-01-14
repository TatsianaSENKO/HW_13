class User {
    #name;
    #email;
    #address;
    #phone;

    constructor(name, email, address, phone) {
        this.#name = name || '';
        this.#email = email || '';
        this.#address = address || '';
        this.#phone = phone || '';
    }

    edit(data) {
        if (!data || (data.name.length == 0 && data.phone.length == 0)) return;

        this.#name = data.name;
        this.#email = data.email;
        this.#address = data.address;
        this.#phone = data.phone;
    }

    get() {
        return {
            name: this.#name,
            email: this.#email,
            address: this.#address,
            phone: this.#phone
        };
    }
}

class Contacts {
    #data = [];
    #lastId = 0;

    add(userData = {}) {
        if (!userData || (userData.name.length == 0 && userData.phone.length == 0)) return;

        const user = new User(userData.name, userData.email, userData.address, userData.phone);

        if(!user) return;

        this.#lastId++;
        user.id = this.#lastId;

        this.#data.push(user);

    }

    edit(id, userData = {}) {
        if(!id) return;

        let user = this.#data.find(function(item) {
            return item.id == id;
        });

        if (!user) return;

        user.edit(userData);

    }

    remove(id) {
        if(!id) return;

        let dataTmp = [];

        dataTmp= this.#data.filter(function(item) {
            return item.id != id;
        });

        this.#data = dataTmp;

    }

    get(print = false) {
        let dataTmp = [];

        switch(print) {
            case 1:
                this.#data.forEach(function(item) {
                    dataTmp.push(item.get());
                });
            break;
            default:
                dataTmp = this.#data;
        };

        return dataTmp;
    }

    updateStorage = () => {

        let storageData = this.get(1);
        storageData = JSON.stringify(storageData);

        if (typeof storageData == 'string') localStorage.setItem('data', storageData);

        document.cookie = 'storageExpiration=' + new Date() + '; max-age=864000';

    }

    getStorage = () => {

        this.clearLocalStorage();

        if (localStorage.length == 0) return false;

        let storageData = JSON.parse(localStorage.getItem('data'));

        console.log(storageData);

        storageData.forEach((item) => {
            this.add(item);
        });

        return this.data;
    }

    clearLocalStorage = () => {

        if (!document.cookie) localStorage.clear();
    }

    data = this.getStorage() || [];
}

class ContactsApp extends Contacts {

    data = this.get();

    modalEdit(id, data = {}) {
        const editElem = document.createElement('div');
        const fieldNameElem = document.createElement('input');
        const fieldEmailElem = document.createElement('input');
        const fieldAddressElem = document.createElement('input');
        const fieldPhoneElem = document.createElement('input');

        const btnSaveElem = document.createElement('button');
        const btnCloseElem = document.createElement('button');

        fieldNameElem.type = 'text';
        fieldEmailElem.type = 'email';
        fieldAddressElem.type = 'text';
        fieldPhoneElem.type = 'tel';

        fieldNameElem.name = 'contacts-field-name';
        fieldEmailElem.name = 'contacts-field-email';
        fieldAddressElem.name = 'contacts-field-address';
        fieldPhoneElem.name = 'contacts-field-phone';

        fieldNameElem.placeholder = 'Name';
        fieldEmailElem.placeholder = 'Email';
        fieldAddressElem.placeholder = 'Address';
        fieldPhoneElem.placeholder = 'Phone';

        btnSaveElem.name = 'edit-btn-save';
        btnCloseElem.name = 'edit-btn-close';

        editElem.classList.add('contacts__modal_edit');

        fieldNameElem.value = data.name;
        fieldEmailElem.value = data.email;
        fieldAddressElem.value = data.address;
        fieldPhoneElem.value = data.phone;

        btnSaveElem.innerHTML = 'Save';
        btnCloseElem.innerHTML = 'X';

        editElem.append(fieldNameElem, fieldEmailElem, fieldAddressElem, fieldPhoneElem, btnSaveElem, btnCloseElem);
        this.contactsContainer.append(editElem);

        btnSaveElem.addEventListener('click', () => {
            const newData = {
                name: fieldNameElem.value,
                email: fieldEmailElem.value,
                address: fieldAddressElem.value,
                phone: fieldPhoneElem.value
            };

            this.onSave(id, newData);
            editElem.remove();
        });

        btnCloseElem.addEventListener('click', function() {
            editElem.remove();
        });

    };

    create() {

        this.contactsContainer = document.createElement('div');
        this.contactsForm = document.createElement('div');
        this.listElem = document.createElement('ul');

        this.h3TitleForm = document.createElement('div');
        this.h3TitleForm.innerHTML = 'Add new contact:';

        this.fieldName = document.createElement('input');
        this.fieldName.type = 'text';
        this.fieldName.name = 'contacts-field-name';
        this.fieldName.placeholder = 'Name';

        this.fieldEmail = document.createElement('input');
        this.fieldEmail.type = 'email';
        this.fieldEmail.name = 'contacts-field-email';
        this.fieldEmail.placeholder = 'Email';

        this.fieldAddress = document.createElement('input');
        this.fieldAddress.type = 'text';
        this.fieldAddress.name = 'contacts-field-address';
        this.fieldAddress.placeholder = 'Address';

        this.fieldPhone = document.createElement('input');
        this.fieldPhone.type = 'tel';
        this.fieldPhone.name = 'contacts-field-phone';
        this.fieldPhone.placeholder = 'Phone';

        this.btnAdd = document.createElement('button');
        this.btnAdd.name = 'contacts-btn-add';
        this.btnAdd.innerHTML = 'Add';

        this.contactsContainer.classList.add('contacts');
        this.contactsForm.classList.add('contacts__form');
        this.listElem.classList.add('contacts__list');
        this.h3TitleForm.classList.add('title');

        document.body.append(this.contactsContainer);
        this.contactsContainer.append(this.contactsForm);
        this.contactsForm.append(this.h3TitleForm, this.fieldName, this.fieldEmail, this.fieldAddress, this.fieldPhone, this.btnAdd);

        return this.contactsContainer;
    };

    update() {
        let data = this.get();

        this.listElem.innerHTML = '';
        data.forEach((item) => {
            let liElem = document.createElement('li');
            let h3ElemName = document.createElement('h3');
            let divElemContacts = document.createElement('div');
            let divElemEmail = document.createElement('div');
            let divElemAddress = document.createElement('div');
            let divElemPhone = document.createElement('div');

            let divElemBtns = document.createElement('div');
            let btnEdit = document.createElement('button');
            let btnRemove = document.createElement('button');

            liElem.classList.add('users__item', 'user');
            h3ElemName.classList.add('user__name');
            divElemContacts.classList.add('user__contacts');
            divElemEmail.classList.add('user__contact');
            divElemAddress.classList.add('user__contact');
            divElemPhone.classList.add('user__contact');
            divElemBtns.classList.add('user__btns')

            liElem.id = item.id;

            btnEdit.innerHTML = '&#9998';
            btnRemove.innerHTML = 'X';


            h3ElemName.innerHTML = item.get().name;
            divElemEmail.innerHTML = `<b>Email:</b> `+ item.get().email;
            divElemAddress.innerHTML = `<b>Address:</b> ` + item.get().address;
            divElemPhone.innerHTML = `<b>Phone:</b> ` + item.get().phone;

            divElemBtns.append(btnEdit, btnRemove);
            liElem.append(h3ElemName, divElemContacts, divElemBtns);
            divElemContacts.append(divElemEmail, divElemAddress, divElemPhone);
            this.listElem.append(liElem);

            btnEdit.addEventListener('click', () =>{
                this.onEdit(item.id);
            });
            btnRemove.addEventListener('click', () =>{
                this.onRemove(item.id);
            });

        });
    };

    onSave = (id, newUserData) => {
        if (!id) return;

        const user = this.data.find((item) =>{
            return item.id == id;
        });

        if (!user) return;

        user.edit(newUserData);
        this.update();
        this.updateStorage();

    };

    onEdit = (id) => {
        if (!id) return;

        const user = this.data.find((item) =>{
            return item.id == id;
        });

        console.log(user);

        if (!user) return;

        this.modalEdit(id, user.get());

        this.updateStorage();

    };

    onRemove = (id) => {
        if (!id) return;

        this.remove(id);
        this.update();

        this.updateStorage();

    };

    onAdd = () => {
        const fieldNameValue = this.fieldName.value;
        const fieldEmailValue = this.fieldEmail.value;
        const fieldAddressValue = this.fieldAddress.value;
        const fieldPhoneValue = this.fieldPhone.value;

        const dataUsers = {
            name: fieldNameValue,
            email: fieldEmailValue,
            address: fieldAddressValue,
            phone: fieldPhoneValue
        };

        this.add(dataUsers);
        this.update();

        this.fieldName.value = '';
        this.fieldEmail.value = '';
        this.fieldAddress.value = '';
        this.fieldPhone.value = '';

        this.updateStorage();

    }

    init() {

        this.create();

        if (!this.listElem || !this.fieldName || !this.fieldEmail || !this.fieldAddress || !this.fieldPhone || !this.btnAdd) return;

        this.contactsContainer.append(this.listElem);

        this.btnAdd.addEventListener('click', this.onAdd);

        this.update();
    }

}

let contactsApp = new ContactsApp();
contactsApp.init();