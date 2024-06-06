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
        lesson : '',
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
        async checkOut() {
            try {
                const order = {
                    customerName: this.customerName,
                    customerNumber: this.customerNumber,
                    items: this.cart
                };
                const response = await fetch(`${this.serverUrl}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(order)
                });

                const data = await response.json();
                if (response.ok) {
                    alert(data.msg);
                    this.updateLessons();
                    this.showLessons = true;
                    this.cart = [];
                    this.customerName = '';
                    this.customerNumber = '';
                } else {
                    alert('Error placing order');
                }
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
                alert('Error placing order');
                
            }
        },
        
        async searchLessons(){
            try {

                if (!this.searchTerm.trim()) {
                    alert('Search term cannot be empty');
                    return;
                }

                const queries = new URLSearchParams();
                queries.append('subject', this.searchTerm)
                queries.append('location', this.searchTerm)
                const response = await fetch(`${this.serverUrl}/lessons/search?${queries.toString()}`,
                
            );
                const lessons = await response.json();
                
                this.sortedLessons = lessons;
                } catch (error) {
                    console.error('Error searching lessons:', error);
                }
            
        },
      
        getImageUrl(imagePath) {
            return `${this.serverUrl}/${imagePath}`;
        },
        canAddToCart(lesson) {
            return lesson.availability > this.cartCount(lesson._id);
        },
        cartCount(_id) {
            let count = 0;
            for (let i = 0; i < this.cart.length; i++) {
                if (this.cart[i] === _id) {
                    count++;
                }
            }
            return count;
        },
        addToCart(lesson) {
            this.cart.push(lesson._id);
        },
        removeFromCart(_id) {
            let index = this.cart.indexOf(_id);
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
        // checkOut() {
        //     alert("Order Placed");
        //     this.showLessons = !this.showLessons;
        //     this.cart = [];
        //     this.customerName = '';
        //     this.customerNumber = '';
        // },
        sortLessons() {
            
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
         
        async updateLessons() {
            try {
                for (const lessonId of this.cart) {
                    const lesson = this.lessons.find(lesson => lesson._id === lessonId);
                    if (lesson) {
                        const decrement = this.cartCount(lessonId);
                        const updatedSpaces = lesson.availability - decrement;
        
                        // Update lesson availability on the server
                        const response = await fetch(`${this.serverUrl}/lessons/${lessonId}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ availability: updatedSpaces })
                        });
        
                        if (!response.ok) {
                            throw new Error(`Failed to update lesson ${lessonId}`);
                        }
        
                        // Update lesson availability
                        await this.getLessons();
                    }
                }
            } catch (error) {
                console.error('Error updating lessons:', error);
            }
        }
        
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
