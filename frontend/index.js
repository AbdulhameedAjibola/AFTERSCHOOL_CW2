let app = new Vue({
    el: '#app',
    data: {
        header: "Hameed's Extra lesson's Site",
        checkout: "Checkout Page",
        lessons: [],
        serverUrl: 'https://afterschool-cw2.onrender.com',
        showLessons: true,
        cart: [],
        sortedLessons: [],
        sortBy: '',
        ascending: false,
        descending: false,
        searchTerm: '',
        customerName: '',
        customerNumber: '',
    },
    methods: {
        async getLessons() {
            try {
                const response = await fetch(`${this.serverUrl}/lessons`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                this.lessons = await response.json();
                this.sortedLessons = [...this.lessons]; // Initialize sortedLessons with fetched lessons
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        },
        getImageUrl(imagePath) {
            return `${this.serverUrl}/${imagePath}`;
        },
        canAddToCart(lesson) {
            return lesson.availability > this.cartCount(lesson.id);
        },
        cartCount(id) {
            let count = 0;
            for (let i = 0; i < this.cart.length; i++) {
                if (this.cart[i] === id) {
                    count++;
                }
            }
            return count;
        },
        addToCart(lesson) {
            this.cart.push(lesson.id);
        },
        removeFromCart(lessonID) {
            let index = this.cart.indexOf(lessonID);
            if (index !== -1) {
                this.cart.splice(index, 1);
            }
        },
        showCheckout() {
            this.showLessons = !this.showLessons;
        },
        showCheckoutButton() {
            return this.isValidNumber() && this.isValidText();
        },
        isValidNumber() {
            return /^[1-9]\d*$/.test(this.customerNumber) && this.customerNumber.length === 11;
        },
        isValidText() {
            return /^[a-zA-Z]+$/.test(this.customerName) && (this.customerName.length >= 3 && this.customerName.length <= 12);
        },
        isCartEmpty() {
            if (this.showCheckout && this.cart.length <= 0) {
                this.showLessons = true;
            }
        },
        checkOut() {
            alert("Order Placed");
            this.showLessons = !this.showLessons;
            this.cart = [];
            this.customerName = '';
            this.customerNumber = '';
        },
        sortLessons() {
            this.sortedLessons = [...this.lessons];
            // Sort the lessons based on the selected criteria
            if (this.sortBy === 'subject') {
                this.sortedLessons.sort((a, b) => this.sortFunction(a.subject, b.subject));
            } else if (this.sortBy === 'price') {
                this.sortedLessons.sort((a, b) => this.sortFunction(a.price, b.price));
            } else if (this.sortBy === 'location') {
                this.sortedLessons.sort((a, b) => this.sortFunction(a.location, b.location));
            } else if (this.sortBy === 'availability') {
                this.sortedLessons.sort((a, b) => this.sortFunction(a.availability, b.availability));
            }

            // Reverse the sorted array if descending flag is true
            if (this.descending) {
                this.sortedLessons.reverse();
            }
        },
        sortFunction(a, b) {
            if (typeof a === 'string' && typeof b === 'string') {
                return a.localeCompare(b);
            } else {
                return a - b;
            }
        },
    },
    computed: {
        cartItemCount() {
            return this.cart.length || "";
        },
        cartSet() {
            return new Set(this.cart);
        }
    },
    watch: {
        sortBy() {
            this.sortLessons();
        },
        ascending() {
            if (this.ascending) {
                this.descending = false;
            }
            this.sortLessons();
        },
        descending() {
            if (this.descending) {
                this.ascending = false;
            }
            this.sortLessons();
        }
    },
    mounted() {
        this.getLessons();
    }
});
