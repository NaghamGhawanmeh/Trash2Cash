import "./AdminCategory.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  setCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} from "../../redux/reducers/adminCategories";
import { Trash2, Edit, Check, X } from "lucide-react";

const AdminCategory = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.adminCategories.categories);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedCategory, setEditedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    category_name: "",
    description: "",
    image: "",
    price_per_kg: "",
    price_per_dimensions: "",
    price_type: "kg", // Default price type
  });
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);

  useEffect(() => {
    axios
      .get("https://trash2cash-liav.onrender.com/category/getAllCategories")
      .then((response) => {
        dispatch(setCategories(response.data.Categories));
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, [dispatch]);

  const handleAddCategory = () => {
    // Prepare the data based on price type selection
    const categoryData = {
      category_name: newCategory.category_name,
      description: newCategory.description,
      image: newCategory.image,
      price_per_kg:
        newCategory.price_type === "kg" ? newCategory.price_per_kg : "0",
      price_per_dimensions:
        newCategory.price_type === "dimensions"
          ? newCategory.price_per_dimensions
          : "0",
    };

    axios
      .post("https://trash2cash-liav.onrender.com/category/addCategory", categoryData)
      .then((response) => {
        dispatch(addCategory(categoryData));
        setNewCategory({
          category_name: "",
          description: "",
          image: "",
          price_per_kg: "",
          price_per_dimensions: "",
          price_type: "kg",
        });
        setShowAddCategoryForm(false);
      })
      .catch((error) => {
        console.error("Error adding category:", error);
      });
  };

  const handleDeleteCategory = (categoryId) => {
    axios
      .delete(`https://trash2cash-liav.onrender.com/category/${categoryId}`)
      .then(() => {
        dispatch(deleteCategory(categoryId));
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
      });
  };

  const handleUpdateCategory = () => {
    if (!editedCategory) return;

    const updatedData = {
      category_name: editedCategory.category_name,
      description: editedCategory.description,
      price_per_kg: editedCategory.price_per_kg,
      price_per_dimensions: editedCategory.price_per_dimensions,
      image: editedCategory.image,
    };

    axios
      .put(`https://trash2cash-liav.onrender.com/category/${editedCategory.id}`, updatedData)
      .then((response) => {
        dispatch(updateCategory({ id: editedCategory.id, updatedData }));
        cancelEdit();
      })
      .catch((error) => {
        console.error("Error updating category:", error);
      });
  };

  const uploadHandler = (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "xyz123");
    axios
      .post("https://api.cloudinary.com/v1_1/dozr5pfwt/upload", data)
      .then((res) => {
        if (editedCategory) {
          handleEditChange("image", res.data.url);
        } else {
          setNewCategory({ ...newCategory, image: res.data.url });
        }
      })
      .catch((err) => console.log(err.response?.data));
  };

  const handleViewDetails = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setEditedCategory({ ...category });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedCategory(null);
  };

  const handleEditChange = (field, value) => {
    setEditedCategory((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderTableRow = (category, index) => {
    if (!category) return null;
    const isEditing = editingId === category.id;

    return (
      <tr key={category.id || index} className="table-row">
        <td className="table-cell">
          {isEditing ? (
            <label className="btn btn-upload" style={{ width: "200px" }}>
              Upload Image
              <input
                type="file"
                hidden
                onChange={(e) => uploadHandler(e.target.files[0])}
              />
            </label>
          ) : (
            <>
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.category_name}
                  className="category-img"
                />
              ) : (
                <div className="img-placeholder">No Image</div>
              )}
            </>
          )}
        </td>
        <td className="table-cell">
          {isEditing ? (
            <input
              type="text"
              value={editedCategory.category_name}
              onChange={(e) =>
                handleEditChange("category_name", e.target.value)
              }
              className="form-input"
            />
          ) : (
            category.category_name
          )}
        </td>
        <td className="table-cell">
          {isEditing ? (
            <input
              type="text"
              value={editedCategory.description}
              onChange={(e) => handleEditChange("description", e.target.value)}
              className="form-input"
            />
          ) : (
            category.description
          )}
        </td>
        <td className="table-cell">
          {isEditing ? (
            <input
              type="number"
              value={editedCategory.price_per_kg}
              onChange={(e) => handleEditChange("price_per_kg", e.target.value)}
              className="form-input"
            />
          ) : (
            `$${category.price_per_kg}`
          )}
        </td>
        <td className="table-cell">
          {isEditing ? (
            <input
              type="number"
              value={editedCategory.price_per_dimensions}
              onChange={(e) =>
                handleEditChange("price_per_dimensions", e.target.value)
              }
              className="form-input"
            />
          ) : (
            `$${category.price_per_dimensions}`
          )}
        </td>
        <td className="table-cell">
          <div className="action-buttons">
            {isEditing ? (
              <>
                <Check
                  className="icon-btn icon-save"
                  size={20}
                  onClick={handleUpdateCategory}
                />
                <X
                  className="icon-btn icon-cancel"
                  size={20}
                  onClick={cancelEdit}
                />
              </>
            ) : (
              <>
                <Edit
                  className="icon-btn icon-edit"
                  size={20}
                  onClick={() => startEdit(category)}
                />
                <Trash2
                  className="icon-btn icon-delete"
                  size={20}
                  onClick={() => handleDeleteCategory(category.id)}
                />
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="admin-container">
      <div className="modal-header">
        {/* <h2 className="modal-title">Categories Management</h2> */}
      </div>

      <div>
        <table className="admin-table">
          <thead>
            <tr>
              <th className="table-header">Image</th>
              <th className="table-header">Name</th>
              <th className="table-header">Description</th>
              <th className="table-header">Price/KG</th>
              <th className="table-header">Price/Dim</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories?.length > 0 ? (
              categories
                .filter(Boolean)
                .map((category, index) => renderTableRow(category, index))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="table-cell"
                  style={{ textAlign: "center" }}
                >
                  No categories available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => setShowAddCategoryForm(!showAddCategoryForm)}
        className={`btn ${showAddCategoryForm ? "btn-red" : "btn-green"}`}
        style={{ width: "300px", marginTop: "15px" }}
      >
        {showAddCategoryForm ? "Cancel" : "Add New Category"}
      </button>

      {showAddCategoryForm && (
        <div className="add-category-form" style={{ marginTop: "30px" }}>
          <h3 className="form-title">Add New Category</h3>

          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="categoryName">Category Name</label>
                <input
                  id="categoryName"
                  type="text"
                  value={newCategory.category_name}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      category_name: e.target.value,
                    })
                  }
                  className="form-input"
                  placeholder="Enter category name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="categoryDesc">Description</label>
                <input
                  id="categoryDesc"
                  type="text"
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                  className="form-input"
                  placeholder="Enter description"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price Type</label>
                <div className="price-selection">
                  <label className="price-option">
                    <input
                      type="radio"
                      name="priceType"
                      value="kg"
                      checked={newCategory.price_type === "kg"}
                      onChange={() =>
                        setNewCategory({ ...newCategory, price_type: "kg" })
                      }
                    />
                    <span>Price per KG</span>
                  </label>
                  <label className="price-option">
                    <input
                      type="radio"
                      name="priceType"
                      value="dimensions"
                      checked={newCategory.price_type === "dimensions"}
                      onChange={() =>
                        setNewCategory({
                          ...newCategory,
                          price_type: "dimensions",
                        })
                      }
                    />
                    <span>Price per Dimensions</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="priceValue">
                  {newCategory.price_type === "kg"
                    ? "Price per KG ($)"
                    : "Price per Dimensions ($)"}
                </label>
                <input
                  id="priceValue"
                  type="number"
                  value={
                    newCategory.price_type === "kg"
                      ? newCategory.price_per_kg
                      : newCategory.price_per_dimensions
                  }
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      [newCategory.price_type === "kg"
                        ? "price_per_kg"
                        : "price_per_dimensions"]: e.target.value,
                    })
                  }
                  className="form-input"
                  placeholder={`Enter price per ${newCategory.price_type === "kg" ? "KG" : "dimensions"}`}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group upload-group">
                <label>Category Image</label>
                <label className="image-upload-btn">
                  <span className="upload-icon">📁</span>
                  <span>Upload Image</span>
                  <input
                    type="file"
                    hidden
                    onChange={(e) => uploadHandler(e.target.files[0])}
                  />
                </label>
                {newCategory.image && (
                  <div className="image-preview">
                    <img src={newCategory.image} alt="Category preview" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              onClick={() => setShowAddCategoryForm(false)}
              className="btn btn-cancel"
              style={{ backgroundColor: "white" }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddCategory}
              className="btn btn-submit"
              style={{ backgroundColor: "green", color: "white" }}
              disabled={
                !newCategory.category_name ||
                (!newCategory.price_per_kg && !newCategory.price_per_dimensions)
              }
            >
              Add Category
            </button>
          </div>
        </div>
      )}

      {showModal && selectedCategory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{selectedCategory.category_name}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            {selectedCategory.image && (
              <img
                src={selectedCategory.image}
                alt={selectedCategory.category_name}
                className="category-img"
                style={{ width: "100%", height: "200px" }}
              />
            )}
            <div style={{ marginTop: "16px" }}>
              <p>{selectedCategory.description}</p>
              {selectedCategory.price_per_kg > 0 && (
                <p>
                  <strong>Price per KG:</strong> $
                  {selectedCategory.price_per_kg}
                </p>
              )}
              {selectedCategory.price_per_dimensions > 0 && (
                <p>
                  <strong>Price per Dimensions:</strong> $
                  {selectedCategory.price_per_dimensions}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategory;
