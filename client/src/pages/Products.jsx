import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import "./Products.css";

const CATEGORIES = [
  { id: "", name: "Tất cả" },
  { id: "cham-soc-da", name: "Chăm sóc da" },
  { id: "trang-diem", name: "Trang điểm" },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  const setCategory = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat) next.set("category", cat); else next.delete("category");
    next.delete("search");
    setSearchParams(next);
  };

  return (
    <div className="products-page">
      <div className="products-page__hero">
        <div className="container">
          <h1>Sản phẩm</h1>
          {search && <p>Kết quả tìm kiếm cho: <strong>"{search}"</strong></p>}
        </div>
      </div>

      <div className="container products-page__body">
        <aside className="products-page__sidebar">
          <h3>Danh mục</h3>
          <ul>
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <button
                  className={category === c.id ? "active" : ""}
                  onClick={() => setCategory(c.id)}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="products-page__main">
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
}
