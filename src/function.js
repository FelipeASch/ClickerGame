$(document).ready(function () {
    let wood = 0;
    let stone = 0;
    let food = 0;
    let multWood = 1;
    let multStone = 1;
    let multFood = 1;

    const resourceMap = {
        wood: {
            button: "#woodCut",
            count: () => wood += multWood,
            element: "#wood",
            label: "Madeira: ",
            get value() { return wood; }
        },
        stone: {
            button: "#stoneCollect",
            count: () => stone += multStone,
            element: "#stone",
            label: "Pedra: ",
            get value() { return stone; }
        },
        food: {
            button: "#foodPick",
            count: () => food += multFood,
            element: "#food",
            label: "Comida: ",
            get value() { return food; }
        }
    };

    Object.values(resourceMap).forEach(resource => {
        $(resource.button).click(() => {
            resource.count();
            updateInventory(resource);
        });
    });

    function updateInventory(resource) {
        $(resource.element).html(resource.label + resource.value);
    }

    const upgradesPerPage = 4;
    let currentPage = 1;

    const upgrades = [
        {
            id: 1,
            nome: "Afiar Machado",
            custo: { wood: 20 },
            aplicar: function () { multWood += 1; }
        },
        {
            id: 2,
            nome: "Carrinho de Pedras",
            custo: { stone: 30 },
            aplicar: function () { multStone += 1; }
        },
        {
            id: 3,
            nome: "Cesta de Comida",
            custo: { food: 25 },
            aplicar: function () { multFood += 1; }
        },
        {
            id: 4,
            nome: "Motor de Madeira",
            custo: { wood: 50 },
            aplicar: function () { multWood += 2; }
        },
        {
            id: 5,
            nome: "Machado de Ferro",
            custo: { wood: 70, stone: 30 },
            aplicar: function () { multWood += 3; }
        }
    ];

    function temRecursosSuficientes(custo) {
        return (!custo.wood || wood >= custo.wood) &&
               (!custo.stone || stone >= custo.stone) &&
               (!custo.food || food >= custo.food);
    }

    function comprarUpgrade(id) {
        const upgrade = upgrades.find(u => u.id === id);
        if (!upgrade) return;

        if (temRecursosSuficientes(upgrade.custo)) {
            if (upgrade.custo.wood) wood -= upgrade.custo.wood;
            if (upgrade.custo.stone) stone -= upgrade.custo.stone;
            if (upgrade.custo.food) food -= upgrade.custo.food;

            upgrade.aplicar();

            const index = upgrades.findIndex(u => u.id === id);
            upgrades.splice(index, 1);

            atualizarInventario();
            renderUpgrades(currentPage);
        } else {
            alert("Recursos insuficientes!");
        }
    }

    function atualizarInventario() {
        Object.values(resourceMap).forEach(updateInventory);
    }

    function renderUpgrades(page) {
        const start = (page - 1) * upgradesPerPage;
        const upgradesPagina = upgrades.slice(start, start + upgradesPerPage);

        $('#upgradeList').html('');
        upgradesPagina.forEach(upg => {
            const btn = $(`<button class=\"upgrade-btn\">${upg.nome}</button>`);
            btn.click(() => comprarUpgrade(upg.id));
            $('#upgradeList').append(btn);
        });

        renderPagination(page);
    }

    function renderPagination(current) {
        const totalPages = Math.ceil(upgrades.length / upgradesPerPage);
        const container = $('#pagination');
        container.html('');

        for (let i = 1; i <= totalPages; i++) {
            const btn = $('<button>').text(i);
            if (i === current) btn.css('font-weight', 'bold');
            btn.on('click', () => {
                currentPage = i;
                renderUpgrades(currentPage);
            });
            container.append(btn);
        }
    }

    $('#showUpgrades').on('click', () => {
        $('#showUpgrades').hide();
        $('#closeUpgrades').show();
        $('#upgradeBox').show();
        renderUpgrades(currentPage);
    });

    $('#closeUpgrades').on('click', () => {
        $('#showUpgrades').show();
        $('#closeUpgrades').hide();
        $('#upgradeBox').hide();
        currentPage = 1;
    });
});
