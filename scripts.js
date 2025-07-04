document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const nameDisplay = document.getElementById('pokemon-name');
    const imageDisplay = document.getElementById('pokemon-image');
    const idDisplay = document.getElementById('pokemon-id');
    const sourceText = document.getElementById('source-text');
    const typesContainer = document.getElementById('pokemon-types');
    const randomButton = document.getElementById('random-btn');
    const card = document.querySelector('.pokemon-card');

    const typeColors = {
        normal: '#A8A77A', grass: '#7AC74C', fire: '#EE8130', water: '#6390F0',
        electric: '#F7D02C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
        ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
        rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
        steel: '#B7B7CE', fairy: '#D685AD',
    };

    let p5Instance = null;

    async function fetchPokemon(id) {
        if (id <= 0 || id > 1025) {
            // MODIFIÉ
            displayError("No Pokémon for this date!");
            return;
        }
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            if (!response.ok) throw new Error('Pokémon not found.');
            const data = await response.json();
            displayPokemon(data);
        } catch (error) {
            console.error("Fetch error:", error);
            // MODIFIÉ
            displayError("Could not load the Pokémon.");
        }
    }

    function displayPokemon(data) {
        const primaryType = data.types[0].type.name;

        gsap.to(card, { opacity: 0, y: 30, duration: 0.3, onComplete: () => {
            nameDisplay.textContent = data.name;
            idDisplay.textContent = `#${data.id.toString().padStart(4, '0')}`;
            imageDisplay.src = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
            // MODIFIÉ
            imageDisplay.alt = `Image of ${data.name}`;

            typesContainer.innerHTML = '';
            data.types.forEach(typeInfo => {
                const typeName = typeInfo.type.name;
                const badge = document.createElement('span');
                badge.className = 'type-badge';
                badge.textContent = typeName;
                badge.style.background = typeColors[typeName] || '#777';
                typesContainer.appendChild(badge);
            });

            setupP5Sketch(primaryType);
            
            gsap.to(card, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
        }});
    }

    function displayError(message) {
         gsap.to(card, { opacity: 0, y: 30, duration: 0.3, onComplete: () => {
            // MODIFIÉ
            nameDisplay.textContent = "Oops!";
            imageDisplay.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
            imageDisplay.alt = "Error";
            idDisplay.textContent = message;
            typesContainer.innerHTML = '';

            setupP5Sketch('default');
            
            gsap.to(card, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
         }});
    }

    function setupP5Sketch(type) {
        if (p5Instance) {
            p5Instance.remove();
        }
        p5Instance = new p5(sketch(type), 'p5-canvas-container');
    }

    const sketch = (type) => (p) => {
        let particles = [];
        let bgColor;

        p.setup = () => {
            p.createCanvas(p.windowWidth, p.windowHeight);
            let particleColor;

            switch (type) {
                case 'water':
                    bgColor = p.color(10, 20, 80);
                    particleColor = p.color(100, 150, 255, 150);
                    for (let i = 0; i < 100; i++) particles.push(new Bubble(p, particleColor));
                    break;
                case 'fire':
                    bgColor = p.color(100, 20, 10);
                    particleColor = p.color(255, 180, 0, 200);
                    for (let i = 0; i < 150; i++) particles.push(new Spark(p, particleColor));
                    break;
                case 'grass':
                    bgColor = p.color(10, 80, 20);
                    particleColor = p.color(122, 255, 122, 150);
                    for (let i = 0; i < 50; i++) particles.push(new Leaf(p, particleColor));
                    break;
                default:
                    bgColor = p.color(40, 40, 50);
                    particleColor = p.color(200, 200, 200, 100);
                    for (let i = 0; i < 200; i++) particles.push(new Star(p, particleColor));
                    break;
            }
        };

        p.draw = () => {
            p.background(bgColor);
            for (let particle of particles) {
                particle.update();
                particle.show();
            }
        };

        p.windowResized = () => {
             p.resizeCanvas(p.windowWidth, p.windowHeight);
        };

        class Bubble {
            constructor(p, color) { this.p = p; this.color = color; this.x = p.random(p.width); this.y = p.random(p.height); this.r = p.random(5, 15); }
            update() { this.y -= 1.5; if (this.y < -this.r) this.y = this.p.height + this.r; }
            show() { this.p.noStroke(); this.p.fill(this.color); this.p.ellipse(this.x, this.y, this.r * 2); }
        }
        class Spark {
            constructor(p, color) { this.p = p; this.color = color; this.x = p.random(p.width); this.y = p.random(p.height, p.height * 2); this.len = p.random(10, 30); }
            update() { this.y -= 7; if (this.y < -this.len) { this.y = this.p.random(this.p.height, this.p.height * 2); this.x = this.p.random(this.p.width); }}
            show() { this.p.stroke(this.color); this.p.strokeWeight(2); this.p.line(this.x, this.y, this.x, this.y - this.len); }
        }
        class Leaf {
            constructor(p, color) { this.p = p; this.color = color; this.x = p.random(p.width); this.y = p.random(-200, -20); this.size = p.random(10, 20); this.spin = p.random(-0.05, 0.05); this.angle = 0; }
            update() { this.y += 1.5; this.x += this.p.sin(this.angle); this.angle += this.spin; if (this.y > this.p.height + 20) { this.y = p.random(-200, -20); this.x = this.p.random(this.p.width); }}
            show() { this.p.noStroke(); this.p.fill(this.color); this.p.push(); this.p.translate(this.x, this.y); this.p.rotate(this.angle); this.p.ellipse(0, 0, this.size, this.size / 2); this.p.pop(); }
        }
         class Star {
            constructor(p, color) { this.p = p; this.color = color; this.x = p.random(p.width); this.y = p.random(p.height); this.size = p.random(1, 3); this.speed = this.size * 0.3; }
            update() { this.x -= this.speed; if (this.x < 0) { this.x = this.p.width; this.y = this.p.random(this.p.height); } }
            show() { this.p.noStroke(); this.p.fill(this.color); this.p.ellipse(this.x, this.y, this.size); }
        }
    };
    
    function getPokemonOfTheDay() {
        const date = new
        date();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const pokemonId = (month * 100) + day - 100;
        // MODIFIÉ : Utilise le format de date anglais
        sourceText.textContent = `Pokémon of ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
        fetchPokemon(pokemonId);
    }
    
    randomButton.addEventListener('click', () => {
        const randomId = Math.floor(Math.random() * 1025) + 1;
        // MODIFIÉ
        sourceText.textContent = "Random Pokémon";
        fetchPokemon(randomId);
    });

    getPokemonOfTheDay();
});