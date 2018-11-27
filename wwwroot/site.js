const carUri = "api/ManageCar";
const accountUri = "Account";

function getCount(data) {
    const el = $("#counter");
    let name = "cars";
    if (data) {
        if (data > 1) {
            name = "cars";
        }
        el.text(data + " " + name);
    } else {
        el.text("No " + name);
    }
}

//$(document).ready(function () {
//    login();
//});

function login() {
    const item = {
        email: $("#login-email").val(),
        password: $("#login-password").val(),
        rememberMe: true
    };
    console.log("Login credentials:", item);

    $.ajax({
        type: "POST",
        accepts: "application/json",
        url: accountUri + "/Login",
        contentType: "application/json",
        data: JSON.stringify(item),
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("ERROR:".jqXHR);
            console.error("textStatus=" + textStatus + ", errorThrown=" + errorThrown + "...");
            alert("ERROR: " + textStatus + ": " + errorThrown);
        },
        success: function (result) {
            alert(result);
            getData();
        }
    });
}

function getData() {
    $.ajax({
        type: "GET",
        url: carUri,
        cache: false,
        success: function (data) {
            const tBody = $("#cars");

            $(tBody).empty();

            getCount(data.length);

            $.each(data, function (key, item) {
                const tr = $("<tr></tr>")
                    .append($("<td></td>").text(item.name))
                    .append($("<td></td>").text(item.mark))
                    .append($("<td></td>").text(item.model))
                    .append(
                        $("<td></td>").append(
                            $("<button>Edit</button>").on("click", function () {
                                editItem(item.id);
                            })
                        )
                    )
                    .append(
                        $("<td></td>").append(
                            $("<button>Delete</button>").on("click", function () {
                                deleteItem(item.id);
                            })
                        )
                    );

                tr.appendTo(tBody);
            });

            cars = data;
        }
    });
}

function addItem() {
    const item = {
        name: $("#add-name").val(),
        mark: $("#add-mark").val(),
        model: $("#add-model").val(),
        registered: new Date()
    };
    console.log("item", item);  // DEBUG

    $.ajax({
        type: "POST",
        accepts: "application/json",
        url: carUri,
        contentType: "application/json",
        data: JSON.stringify(item),
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("ERROR:".jqXHR);
            console.error("textStatus=" + textStatus + ", errorThrown=" + errorThrown + "...");
            alert("ERROR: " + textStatus + ": " + errorThrown);
        },
        success: function (result) {
            getData();
            $("#add-name").val("");
        }
    });
}

function deleteItem(id) {
    $.ajax({
        url: carUri + "/" + id,
        type: "DELETE",
        success: function (result) {
            getData();
        }
    });
}

function editItem(id) {
    $.each(todos, function (key, item) {
        if (item.id === id) {
            $("#edit-id").val(item.id)
            $("#edit-name").val(item.name);
            $("#edit-mark").val(item.mark);
            $("#edit-model").val(item.model);
        }
    });
    $("#spoiler").css({ display: "block" });
}

$(".my-form").on("submit", function () {
    const item = {
        name: $("#edit-name").val(),
        mark: $("#edit-mark").val(),
        model: $("#edit-model").val(),
        id: $("#edit-id").val()
    };

    $.ajax({
        url: carUri + "/" + $("#edit-id").val(),
        type: "PUT",
        accepts: "application/json",
        contentType: "application/json",
        data: JSON.stringify(item),
        success: function (result) {
            getData();
        }
    });

    closeInput();
    return false;
});

function closeInput() {
    $("#spoiler").css({ display: "none" });
}
