class Town {
    constructor(name, population, x, y) {
        this.name       = name;
        this.population = population;
        this.x          = x;
        this.y          = y;
    }
}

class ActiveItem {
    constructor(shop_item, x, y) {
        this.shop_item   = shop_item;
        this.x           = x;
        this.y           = y;
        this.current_day = this.shop_item.days;
    }

    draw() {
        const opacity_fraction = parseFloat(((this.current_day - 1) + (1 - (day_progression_percent * 0.01))).toFixed(2));

        if (!opacity_fraction) {
            return;
        }

        india_context.fillStyle = 'rgba(230, 0, 0, ' + opacity_fraction / this.shop_item.days + ')';
        india_context.beginPath();
        india_context.arc(this.x, this.y, get_item_radius(this.shop_item), 0, 2 * Math.PI, false);
        india_context.fill();
    }

    tick() {
        if (this.current_day < 1) {
            const index_in_active_items_array = active_items.indexOf(this);

            if (index_in_active_items_array !== -1) {
                active_items.splice(index_in_active_items_array, 1);
            }

            return;
        }

        saved_variables.population = (parseInt(saved_variables.population) - this.shop_item.kpd).toString();
        save_variables('population');

        this.current_day--;
    }
}

const india_canvas  = document.querySelector('#india');
const india_context = india_canvas.getContext('2d');

let cursor                   = {x: 0, y: 0};
let towns                    = [];
let game_paused              = false;
let time_speed_divisor       = 1;
let selected_inventory_item  = 0;
let active_items             = []
let cursor_in_india          = false;
let calculated_target_radius = 0;
let day_progression_percent = 0;

towns.push(new Town('Delhi', 100, 183, 139));

function draw_india(ctx, xoff, yoff, xmul, ymul) {
    ctx.clearRect(0, 0, india_canvas.clientWidth, india_canvas.clientHeight);
    ctx.font = '14px Arial';

    // background
    ctx.fillStyle = '#559f19';
    ctx.beginPath();
    ctx.lineTo(0 + xoff, 0 + yoff);
    ctx.lineTo(0 + xoff, 195 * ymul + yoff);
    ctx.lineTo(29 * xmul + xoff, 226 * ymul + yoff);
    ctx.lineTo(55 * xmul + xoff, 236 * ymul + yoff);
    ctx.lineTo(77 * xmul + xoff, 230 * ymul + yoff);
    ctx.lineTo(112 * xmul + xoff, 233 * ymul + yoff);
    ctx.lineTo(229 * xmul + xoff, 273 * ymul + yoff);
    ctx.lineTo(356 * xmul + xoff, 250 * ymul + yoff);
    ctx.lineTo(377 * xmul + xoff, 263 * ymul + yoff);
    ctx.lineTo(417 * xmul + xoff, 248 * ymul + yoff);
    ctx.lineTo(440 * xmul + xoff, 291 * ymul + yoff);
    ctx.lineTo(463 * xmul + xoff, 328 * ymul + yoff);
    ctx.lineTo(461 * xmul + xoff, 349 * ymul + yoff);
    ctx.lineTo(461 * xmul + xoff, 361 * ymul + yoff);
    ctx.lineTo(478 * xmul + xoff, 369 * ymul + yoff);
    ctx.lineTo(503 * xmul + xoff, 351 * ymul + yoff);
    ctx.lineTo(504 * xmul + xoff, 343 * ymul + yoff);
    ctx.lineTo(531 * xmul + xoff, 408 * ymul + yoff);
    ctx.lineTo(529 * xmul + xoff, 0 + yoff);
    ctx.closePath();
    ctx.fill();

    // sri lanka
    ctx.beginPath();
    ctx.lineTo(228 * xmul + xoff, 465 * ymul + yoff);
    ctx.lineTo(226 * xmul + xoff, 483 * ymul + yoff);
    ctx.lineTo(222 * xmul + xoff, 494 * ymul + yoff);
    ctx.lineTo(225 * xmul + xoff, 502 * ymul + yoff);
    ctx.lineTo(227 * xmul + xoff, 518 * ymul + yoff);
    ctx.lineTo(234 * xmul + xoff, 526 * ymul + yoff);
    ctx.lineTo(252 * xmul + xoff, 519 * ymul + yoff);
    ctx.lineTo(258 * xmul + xoff, 509 * ymul + yoff);
    ctx.lineTo(253 * xmul + xoff, 495 * ymul + yoff);
    ctx.lineTo(249 * xmul + xoff, 484 * ymul + yoff);
    ctx.lineTo(242 * xmul + xoff, 472 * ymul + yoff);
    ctx.closePath();
    ctx.fill();

    // india
    ctx.fillStyle = '#c07c46';
    ctx.beginPath();
    ctx.lineTo(128 * xmul + xoff, 25 * ymul + yoff);
    ctx.lineTo(130 * xmul + xoff, 35 * ymul + yoff);
    ctx.lineTo(129 * xmul + xoff, 41 * ymul + yoff);
    ctx.lineTo(128 * xmul + xoff, 47 * ymul + yoff);
    ctx.lineTo(135 * xmul + xoff, 55 * ymul + yoff);
    ctx.lineTo(140 * xmul + xoff, 63 * ymul + yoff);
    ctx.lineTo(154 * xmul + xoff, 70 * ymul + yoff);
    ctx.lineTo(141 * xmul + xoff, 78 * ymul + yoff);
    ctx.lineTo(138 * xmul + xoff, 93 * ymul + yoff);
    ctx.lineTo(128 * xmul + xoff, 109 * ymul + yoff);
    ctx.lineTo(117 * xmul + xoff, 114 * ymul + yoff);
    ctx.lineTo(115 * xmul + xoff, 126 * ymul + yoff);
    ctx.lineTo(101 * xmul + xoff, 137 * ymul + yoff);
    ctx.lineTo(95 * xmul + xoff, 151 * ymul + yoff);
    ctx.lineTo(78 * xmul + xoff, 153 * ymul + yoff);
    ctx.lineTo(72 * xmul + xoff, 148 * ymul + yoff);
    ctx.lineTo(56 * xmul + xoff, 168 * ymul + yoff);
    ctx.lineTo(65 * xmul + xoff, 174 * ymul + yoff);
    ctx.lineTo(68 * xmul + xoff, 189 * ymul + yoff);
    ctx.lineTo(84 * xmul + xoff, 215 * ymul + yoff);
    ctx.lineTo(49 * xmul + xoff, 217 * ymul + yoff);
    ctx.lineTo(38 * xmul + xoff, 228 * ymul + yoff);
    ctx.lineTo(52 * xmul + xoff, 243 * ymul + yoff);
    ctx.lineTo(72 * xmul + xoff, 238 * ymul + yoff);
    ctx.lineTo(70 * xmul + xoff, 245 * ymul + yoff);
    ctx.lineTo(47 * xmul + xoff, 254 * ymul + yoff);
    ctx.lineTo(72 * xmul + xoff, 280 * ymul + yoff);
    ctx.lineTo(96 * xmul + xoff, 271 * ymul + yoff);
    ctx.lineTo(103 * xmul + xoff, 261 * ymul + yoff);
    ctx.lineTo(102 * xmul + xoff, 251 * ymul + yoff);
    ctx.lineTo(111 * xmul + xoff, 253 * ymul + yoff);
    ctx.lineTo(109 * xmul + xoff, 264 * ymul + yoff);
    ctx.lineTo(109 * xmul + xoff, 297 * ymul + yoff);
    ctx.lineTo(119 * xmul + xoff, 349 * ymul + yoff);
    ctx.lineTo(135 * xmul + xoff, 384 * ymul + yoff);
    ctx.lineTo(146 * xmul + xoff, 422 * ymul + yoff);
    ctx.lineTo(155 * xmul + xoff, 436 * ymul + yoff);
    ctx.lineTo(171 * xmul + xoff, 473 * ymul + yoff);
    ctx.lineTo(185 * xmul + xoff, 493 * ymul + yoff);
    ctx.lineTo(199 * xmul + xoff, 487 * ymul + yoff);
    ctx.lineTo(209 * xmul + xoff, 473 * ymul + yoff);
    ctx.lineTo(216 * xmul + xoff, 460 * ymul + yoff);
    ctx.lineTo(225 * xmul + xoff, 458 * ymul + yoff);
    ctx.lineTo(224 * xmul + xoff, 436 * ymul + yoff);
    ctx.lineTo(231 * xmul + xoff, 410 * ymul + yoff);
    ctx.lineTo(230 * xmul + xoff, 372 * ymul + yoff);
    ctx.lineTo(236 * xmul + xoff, 360 * ymul + yoff);
    ctx.lineTo(246 * xmul + xoff, 363 * ymul + yoff);
    ctx.lineTo(247 * xmul + xoff, 353 * ymul + yoff);
    ctx.lineTo(267 * xmul + xoff, 349 * ymul + yoff);
    ctx.lineTo(265 * xmul + xoff, 343 * ymul + yoff);
    ctx.lineTo(313 * xmul + xoff, 298 * ymul + yoff);
    ctx.lineTo(338 * xmul + xoff, 288 * ymul + yoff);
    ctx.lineTo(343 * xmul + xoff, 279 * ymul + yoff);
    ctx.lineTo(343 * xmul + xoff, 268 * ymul + yoff);
    ctx.lineTo(356 * xmul + xoff, 257 * ymul + yoff);
    ctx.lineTo(362 * xmul + xoff, 264 * ymul + yoff);
    ctx.lineTo(376 * xmul + xoff, 262 * ymul + yoff);
    ctx.lineTo(371 * xmul + xoff, 221 * ymul + yoff);
    ctx.lineTo(359 * xmul + xoff, 213 * ymul + yoff);
    ctx.lineTo(365 * xmul + xoff, 201 * ymul + yoff);
    ctx.lineTo(375 * xmul + xoff, 199 * ymul + yoff);
    ctx.lineTo(361 * xmul + xoff, 189 * ymul + yoff);
    ctx.lineTo(365 * xmul + xoff, 184 * ymul + yoff);
    ctx.lineTo(387 * xmul + xoff, 185 * ymul + yoff);
    ctx.lineTo(387 * xmul + xoff, 195 * ymul + yoff);
    ctx.lineTo(430 * xmul + xoff, 202 * ymul + yoff);
    ctx.lineTo(412 * xmul + xoff, 223 * ymul + yoff);
    ctx.lineTo(415 * xmul + xoff, 241 * ymul + yoff);
    ctx.lineTo(424 * xmul + xoff, 228 * ymul + yoff);
    ctx.lineTo(427 * xmul + xoff, 230 * ymul + yoff);
    ctx.lineTo(440 * xmul + xoff, 258 * ymul + yoff);
    ctx.lineTo(447 * xmul + xoff, 220 * ymul + yoff);
    ctx.lineTo(457 * xmul + xoff, 222 * ymul + yoff);
    ctx.lineTo(476 * xmul + xoff, 179 * ymul + yoff);
    ctx.lineTo(497 * xmul + xoff, 160 * ymul + yoff);
    ctx.lineTo(510 * xmul + xoff, 151 * ymul + yoff);
    ctx.lineTo(491 * xmul + xoff, 122 * ymul + yoff);
    ctx.lineTo(479 * xmul + xoff, 128 * ymul + yoff);
    ctx.lineTo(467 * xmul + xoff, 124 * ymul + yoff);
    ctx.lineTo(421 * xmul + xoff, 154 * ymul + yoff);
    ctx.lineTo(426 * xmul + xoff, 169 * ymul + yoff);
    ctx.lineTo(381 * xmul + xoff, 172 * ymul + yoff);
    ctx.lineTo(370 * xmul + xoff, 167 * ymul + yoff);
    ctx.lineTo(374 * xmul + xoff, 149 * ymul + yoff);
    ctx.lineTo(359 * xmul + xoff, 148 * ymul + yoff);
    ctx.lineTo(358 * xmul + xoff, 171 * ymul + yoff);
    ctx.lineTo(334 * xmul + xoff, 172 * ymul + yoff);
    ctx.lineTo(301 * xmul + xoff, 165 * ymul + yoff);
    ctx.lineTo(269 * xmul + xoff, 155 * ymul + yoff);
    ctx.lineTo(232 * xmul + xoff, 135 * ymul + yoff);
    ctx.lineTo(229 * xmul + xoff, 131 * ymul + yoff);
    ctx.lineTo(243 * xmul + xoff, 109 * ymul + yoff);
    ctx.lineTo(210 * xmul + xoff, 86 * ymul + yoff);
    ctx.lineTo(200 * xmul + xoff, 66 * ymul + yoff);
    ctx.lineTo(207 * xmul + xoff, 60 * ymul + yoff);
    ctx.lineTo(211 * xmul + xoff, 68 * ymul + yoff);
    ctx.lineTo(220 * xmul + xoff, 63 * ymul + yoff);
    ctx.lineTo(207 * xmul + xoff, 42 * ymul + yoff);
    ctx.lineTo(212 * xmul + xoff, 32 * ymul + yoff);
    ctx.lineTo(201 * xmul + xoff, 24 * ymul + yoff);
    ctx.lineTo(196 * xmul + xoff, 6 * ymul + yoff);
    ctx.lineTo(176 * xmul + xoff, 17 * ymul + yoff);
    ctx.lineTo(175 * xmul + xoff, 24 * ymul + yoff);
    ctx.lineTo(156 * xmul + xoff, 21 * ymul + yoff);
    ctx.lineTo(128 * xmul + xoff, 25 * ymul + yoff);
    ctx.closePath();
    ctx.fill();

    cursor_in_india = ctx.isPointInPath(cursor.x, cursor.y);

    if (cursor_in_india) {
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth   = 4;
        ctx.stroke();
    }

    for (const town of towns) {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(town.x * xmul + xoff, town.y * ymul + yoff, 5, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillText(town.name, (town.x + 4) * xmul + xoff, (town.y + 8) * ymul + yoff);
    }

    if (shop_items.hasOwnProperty(selected_inventory_item) && cursor_in_india && get_inventory()[selected_inventory_item]) {
        const shop_item = shop_items[selected_inventory_item];

        calculated_target_radius = get_item_radius(shop_item);

        ctx.fillStyle = 'rgba(230, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(cursor.x, cursor.y, calculated_target_radius, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    for (const active_item of active_items) {
        active_item.draw();
    }
}

india_canvas.addEventListener('mousedown', event => {
    if (event.button === 0) {
        if (shop_items.hasOwnProperty(selected_inventory_item) && cursor_in_india) {
            const shop_item = shop_items[selected_inventory_item];

            const copied_cursor = {x: 0, y: 0};
            Object.assign(copied_cursor, cursor);

            let inventory = get_inventory();

            inventory[selected_inventory_item]--;

            set_inventory(inventory);
            update_inventory();

            active_items.push(new ActiveItem(shop_item, copied_cursor.x, copied_cursor.y));
        }
    }
});

india_canvas.height = document.body.clientHeight - 10;
india_canvas.width  = document.body.clientWidth;

const size_multiplier = 1.5;

setInterval(() => draw_india(india_context, (document.body.clientWidth / 2) - 400, 0, size_multiplier, size_multiplier), 150);

india_canvas.addEventListener('mousemove', event => {
    cursor.x = event.clientX;
    cursor.y = event.clientY;
});

let saved_variables = {
    datetime:   0,
    population: 0,
    money:      0,
    inventory:  '{"0":0,"1":0,"2":0}',
};

function reset_variables() {
    const current_date       = new Date().getTime();
    saved_variables.datetime = current_date;

    localStorage.setItem('datetime', current_date.toString());
    localStorage.setItem('population', '1412310691');
    localStorage.setItem('money', '1500000');
    localStorage.setItem('inventory', '{"0":0,"1":0,"2":0}');

    window.location.reload();
}

function get_variables() {
    for (const saved_variable_key in saved_variables) {
        if (!saved_variables.hasOwnProperty(saved_variable_key)) {
            continue;
        }

        saved_variables[saved_variable_key] = localStorage.getItem(saved_variable_key);
    }
}

function save_variables(variables = null) {
    if (null !== variables) {
        if (Array.isArray(variables)) {
            for (const variable of variables) {
                localStorage.setItem(variable, saved_variables[variable]);
            }
        } else {
            localStorage.setItem(variables, saved_variables[variables]);
        }

        return;
    }

    for (const saved_variable_key in saved_variables) {
        if (!saved_variables.hasOwnProperty(saved_variable_key)) {
            continue;
        }

        localStorage.setItem(saved_variable_key, saved_variables[saved_variable_key].toString());
    }
}

get_variables();

const date_text_element       = document.querySelector('#date-text');
const population_element      = document.querySelector('#population');
const day_progression_element = document.querySelector('#day-progression');
const money_element           = document.querySelector('#money');

const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'July', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const days   = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

function update_money() {
    money_element.innerHTML = parseInt(saved_variables.money.toString()).toLocaleString('de-DE');
}

let day_tick = () => {
    const new_date        = new Date(parseInt(saved_variables.datetime.toString()) + (60 * 60 * 24 * 1000));
    let variables_to_save = ['datetime', 'population'];

    saved_variables.datetime   = new_date.getTime();
    saved_variables.population = parseInt(saved_variables.population) + Math.floor(40680 * (Math.random() * (1.3 - 0.3) + 0.3));

    if (new_date.getDate() === 1) {
        saved_variables.money = parseInt(saved_variables.money) + 250000;
        variables_to_save.push('money');
    }

    save_variables(variables_to_save);

    for (const active_item of active_items) {
        active_item.tick();
    }

    date_text_element.innerHTML  = days[new_date.getDay()] + ', ' + new_date.getDate() + '. ' + months[new_date.getMonth()] + ' ' + new_date.getUTCFullYear();
    population_element.innerHTML = parseInt(saved_variables.population.toString()).toLocaleString('de-DE');
    update_money();
};

let tick = () => {
    const day_progression_has_fast_class = day_progression_element.classList.contains('fast-af');

    if (game_paused) {
        if (day_progression_has_fast_class) {
            day_progression_element.style.animationPlayState = 'paused';
        }
        return;
    }

    if (day_progression_percent >= 100) {
        day_progression_percent = 0;

        day_tick();
    } else {
        day_progression_percent++;
    }

    if (!day_progression_has_fast_class) {
        day_progression_element.style.width = day_progression_percent + '%';
    } else {
        day_progression_element.style.animationPlayState = 'running';
    }
};

let game_progression_interval = setInterval(tick, 100);

day_tick();

const pause_button_element   = document.querySelector('#pause-button');
const unpause_button_element = document.querySelector('#unpause-button');

function pause_game() {
    game_paused                     = true;
    pause_button_element.disabled   = true;
    unpause_button_element.disabled = false;
}

function unpause_game() {
    game_paused                     = false;
    pause_button_element.disabled   = false;
    unpause_button_element.disabled = true;
}

const speeds = {
    1:  'normal',
    2:  'double',
    10: 'tenfold',
};

let speed_button_elements = null;

function change_time_speed(speed_multiplier) {
    if (!speed_button_elements) {
        speed_button_elements = {};

        for (const speed_multiplier in speeds) {
            if (!speeds.hasOwnProperty(speed_multiplier)) {
                continue;
            }

            const speed_button_element = document.querySelector('#' + speeds[speed_multiplier] + '-time-button');

            if (!speed_button_element) {
                continue;
            }

            speed_button_elements[speed_multiplier] = speed_button_element;
        }
    }

    for (const speed_button_elements_multiplier in speed_button_elements) {
        if (!speed_button_elements.hasOwnProperty(speed_button_elements_multiplier)) {
            continue;
        }

        speed_button_elements[speed_button_elements_multiplier].disabled = speed_button_elements_multiplier.toString() === speed_multiplier.toString();
    }

    time_speed_divisor = speed_multiplier;

    clearInterval(game_progression_interval);

    game_progression_interval = setInterval(tick, 100 / time_speed_divisor);

    if (time_speed_divisor === 10) {
        day_progression_element.classList.add('fast-af');
    } else if (day_progression_element.classList.contains('fast-af')) {
        day_progression_element.classList.remove('fast-af');
    }
}

const shop_element = document.querySelector('#utilities-shop');

function toggle_shop() {
    if (shop_element.classList.contains('open')) {
        shop_element.classList.remove('open');
    } else {
        shop_element.classList.add('open');
    }
}

let cart = [];

const shop_item_container_element = document.querySelector('#shop-item-container');

const shop_items = [
    {
        name:  'Soldaten',
        price: 1000000,
        kpd:   45000,
        days:  7,
    },
    {
        name:  'Kampfhubschrauber',
        price: 2500000,
        kpd:   90000,
        days:  4,
    },
    {
        name:  'Atombombe',
        price: 100000000,
        kpd:   900000,
        days:  14,
    }
];

function get_item_radius(shop_item) {
    return 20 * (shop_item.kpd / 50000);
}

for (let id = 0; id < shop_items.length; id++) {
    const shop_item = shop_items[id];

    shop_item_container_element.innerHTML += `
        <div class="shop-item" data-id="` + id + `">
            <div class="count"></div>
            <div>` + shop_item.name + `</div>
            <div>` + shop_item.price.toLocaleString('de-DE') + `€</div>
        </div>
    `;
}

const shop_item_elements     = document.querySelectorAll('.shop-item');
const shop_clear_cart_button = document.querySelector('#clear-cart');

for (const shop_item_element of shop_item_elements) {
    shop_item_element.addEventListener('contextmenu', event => {
        event.preventDefault();
    });

    shop_item_element.addEventListener('mousedown', event => {
        const count_element       = shop_item_element.querySelector('.count');
        const target_shop_item_id = shop_item_element.dataset.id;

        if (!count_element) {
            return;
        }

        if (event.button === 0) {
            cart.push(target_shop_item_id);

            count_element.innerHTML = (parseInt(count_element.innerHTML || 0) + 1).toString();
        }

        if (event.button === 2 && cart.includes(target_shop_item_id)) {
            const next_amount = parseInt(count_element.innerHTML || 0) - 1;

            cart.splice(cart.lastIndexOf(target_shop_item_id), 1);

            if (next_amount) {
                count_element.innerHTML = next_amount.toString();
            } else {
                count_element.innerHTML = '';
            }
        }
    });
}

const cart_amount_element         = document.querySelector('#cart-amount');
const purchase_cart_element       = document.querySelector('#purchase-cart');
const cart_amount_wrapper_element = document.querySelector('#cart-amount-wrapper');

let old_cart = [];

setInterval(() => {
    if (cart !== old_cart) {
        let total_amount = 0;

        for (const shop_item_id of cart) {
            total_amount += shop_items[shop_item_id].price;
        }

        if (total_amount && shop_clear_cart_button.style.display !== 'inline') {
            shop_clear_cart_button.style.display = 'inline';
        }

        if (total_amount > saved_variables.money) {
            cart_amount_wrapper_element.classList.add('insufficient-funds');
        } else if (cart_amount_wrapper_element.classList.contains('insufficient-funds')) {
            cart_amount_wrapper_element.classList.remove('insufficient-funds');
        }

        purchase_cart_element.disabled = !total_amount || total_amount > saved_variables.money;
        cart_amount_element.innerHTML  = total_amount.toLocaleString('de-DE') + '€';

        // fuck JS for this.
        Object.assign(old_cart, cart);
    }
}, 250);

function clear_cart() {
    shop_clear_cart_button.style.display = 'none';

    for (const shop_item_element of shop_item_elements) {
        shop_item_element.querySelector('.count').innerHTML = '';
    }

    cart = [];
}

function get_inventory() {
    return JSON.parse(saved_variables.inventory);
}

function set_inventory(new_inventory) {
    saved_variables.inventory = JSON.stringify(new_inventory);

    save_variables('inventory');
}

function change_inventory_item_amount(item_id, amount = 1) {
    let inventory = get_inventory();

    inventory[item_id] += amount;

    set_inventory(inventory);
}

function purchase_items_in_cart() {
    if (!cart.length) {
        return;
    }

    let funds_needed = 0;

    let purchased_items = {};

    for (const item_id of cart) {
        if (!shop_items.hasOwnProperty(item_id)) {
            continue;
        }

        if (!purchased_items.hasOwnProperty(item_id)) {
            purchased_items[item_id] = 0;
        }

        purchased_items[item_id]++;
        funds_needed += shop_items[item_id].price;
    }

    if (!funds_needed || funds_needed > saved_variables.money) {
        return;
    }

    for (const purchased_item_id in purchased_items) {
        if (!purchased_items.hasOwnProperty(purchased_item_id)) {
            continue;
        }

        change_inventory_item_amount(purchased_item_id, purchased_items[purchased_item_id]);
    }

    saved_variables.money -= funds_needed;
    save_variables('money');
    clear_cart();
    update_money();
    update_inventory();
}

const inventory_item_container_element = document.querySelector('#inventory');

function update_inventory() {
    const inventory = get_inventory();

    inventory_item_container_element.innerHTML = '';

    for (const inventory_item_id in inventory) {
        if (!inventory.hasOwnProperty(inventory_item_id)) {
            continue;
        }

        inventory_item_container_element.innerHTML += `
            <div class="inventory-item` + (selected_inventory_item.toString() === inventory_item_id.toString() ? ' selected' : '') + `" data-id="` + inventory_item_id + `">
                <div class="stock">` + inventory[inventory_item_id] + `</div>
                <div class="name">` + shop_items[inventory_item_id].name + `</div>
            </div>
        `;
    }

    for (const inventory_item_element of inventory_item_container_element.querySelectorAll('.inventory-item')) {
        inventory_item_element.addEventListener('mousedown', event => {
            if (event.button !== 0 || selected_inventory_item.toString() === inventory_item_element.dataset.id.toString()) {
                return;
            }

            selected_inventory_item = inventory_item_element.dataset.id.toString();

            update_inventory();
        });
    }
}

update_inventory();