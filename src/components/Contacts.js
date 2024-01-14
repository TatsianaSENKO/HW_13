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

    async getData() {

    if (this.data && this.data.length > 0) return;
    console.log(this.data);

    let serverData = await fetch('https://jsonplaceholder.typicode.com/users')
    .then((response) => response.json());

    let dataTmp = serverData.map((item) => {
        return {
            id: `${this.lastId}`,
            name: item.name,
            email: item.email,
            address: item.address.street,
            phone: item.phone,
        };
    })

    dataTmp.forEach((item) => {
        this.add(item);
    });

    return true;

    }

    data = this.getStorage() || [];
}