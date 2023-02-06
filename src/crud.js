$(function () {
  function LoadProducts() {
    $.ajax({
      method: "GET",
      url: "http://127.0.0.1:5050/products",
      success: (data) => {
        $.each(data, (key, value) => {
          $(`
                        <tr>
                            <td  style=" font-size:12px; width:10%">${
                              value._id
                            }</td>
                            <td>${value.Name}</td>
                            <td>${value.Price}</td>
                            <td>${
                              value.Stock == true ? "Available" : "Out Of Stock"
                            }</td>
                            <td>${value.Category}</td>
                            <td>${value.Rating}</td>
                            <td>
                                <button class="btn btn-info" id="btnEdit" onclick="GetId(${
                                  value.Productid
                                })"  data-bs-target="#EditProductDetails" data-bs-toggle="modal"><span class="bi bi-pen-fill"></span></button>
                                <button class="btn btn-danger" onclick="DeleteClick(${
                                  value.Productid
                                })" id="btnDelete"><span class="bi bi-trash"></span></button>
                            </td>
                        </tr>
                    `).appendTo("tbody");
        });
      },
    });
  }

  function LoadCategories() {
    $.ajax({
      method: "GET",
      url: "http://127.0.0.1:5050/categories",
      success: function (data) {
        console.log(data);
        data.unshift({ Category: "Select a Category" });
        $.each(data, function (key, val) {
          $(`<option>${val.Category}</option>`).appendTo("#Category");
        });
      },
    });
  }

  LoadCategories();
  LoadProducts();
  //Add Product
  $("#btnAdd").click(() => {
    if (
      $("#Name").val() == "" ||
      $("#Price").val() == "" ||
      $("#Category").val() == "Select a Category"
    ) {
      $("#AlertTxt").html("Fill the required Fields").css("color", "red");
    } else {
      $("#AlertTxt").html("");
      var formdata = {
        Name: $("#Name").val(),
        Price: $("#Price").val(),
        Stock: $("#Stock").prop("checked"),
        Category: $("#Category").val(),
        Rating: $("#Rating").val(),
      };

      $.ajax({
        method: "POST",
        url: "http://localhost:5050/addproduct",
        data: formdata,
      });
      alert("Product added");
      location.reload();
    }
  });
  // Update Product
  $("#update").click(() => {
    var confirmation = confirm("Update Data ");
    if (confirmation == true) {
      var EditedData = {
        Productid: $("#EditProductid").val(),
        Name: $("#EditName").val(),
        Price: $("#EditPrice").val(),
        Stock: $("#EditStock").prop("checked"),
        Category: $("#EditCategory").val(),
        Rating: $("#EditRating").val(),
      };
      $.ajax({
        method: "PATCH",
        url: `http://localhost:5050/updatedata/${EditedData.Productid}`,
        data: EditedData,
      });
      location.reload();
    }
  });

  $("#Price").blur(() => {
    if ($("#Name").val() != "" && $("#Price").val() != "") {
      $("#AlertTxt").html("");
    }
  });
});

function GetId(id) {
  $.ajax({
    method: "GET",
    url: `http://localhost:5050/product/${id}`,
    success: (data) => {
      for (var item of data) {
        $("#EditProductid").val(item._id);
        $("#EditName").val(item.Name);
        $("#EditPrice").val(item.Price);
        $("#EditCategory").val(item.Category);
        //$("#EditStock").prop(item.Stock == true ? true : false);
        document.getElementById("EditStock").checked =
          item.Stock == true ? true : false;
        $("#EditRating").val(item.Rating);
      }
    },
  });
}

//Delete Product
function DeleteClick(id) {
  var confirmation = confirm(`Are You Sure to Delete this Product`);
  if (confirmation == true) {
    $.ajax({
      method: "DELETE",
      url: `http://localhost:5050/deleteproduct/${id}`,
      data: id,
    });
    alert("Product Deleted");
    location.reload();
  }
}
