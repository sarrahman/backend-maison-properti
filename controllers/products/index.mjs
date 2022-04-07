import Products from "../../models/Products.mjs";
import ImageKit from "imagekit";

var imagekit = new ImageKit({
  publicKey: "public_1O5i61miOqrME+rf8cfstWmHEjE=",
  privateKey: "private_TATElAIrk3YdcF0SpRYjsmMNU0s=",
  urlEndpoint: "https://ik.imagekit.io/sarrahman",
});

export const getProducts = async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addProducts = async (req, res) => {
  const {
    judul,
    image,
    category,
    price,
    description,
    sertification,
    fasilitas,
    location,
    uid,
    luasBangunan,
    luasTanah,
    kamarTidur,
    kamarMandi,
    lantai,
  } = req.body;
  imagekit
    .upload({
      file: image,
      fileName: judul,
      tags: [category],
    })
    .then((response) => {
      const newProducts = new Products({
        judul,
        image: response.url,
        category,
        price,
        description,
        sertification,
        fasilitas,
        location,
        uid,
        luasBangunan,
        luasTanah,
        kamarTidur,
        kamarMandi,
        lantai,
      });
      try {
        newProducts.save();
        res.status(201).json({
          message: "Product berhasil ditambahkan",
        });
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: error.message,
      });
    });
};

export const getProductsByUid = async (req, res) => {
  try {
    const product = await Products.find({
      uid: req.params.uid,
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  const {
    judul,
    image,
    category,
    price,
    description,
    sertification,
    fasilitas,
    location,
    luasBangunan,
    luasTanah,
    kamarTidur,
    kamarMandi,
    lantai,
  } = req.body;

  const product = await Products.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      message: "produk tidak ditemukan",
    });
  }

  if (image === product.image) {
    try {
      await Products.updateOne(
        { _id: req.params.id },
        {
          $set: {
            judul,
            category,
            price,
            description,
            sertification,
            fasilitas,
            location,
            luasBangunan,
            luasTanah,
            kamarTidur,
            kamarMandi,
            lantai,
          },
        }
      );
      return res.status(200).json({
        message: "Produk berhasil diupdate",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  } else {
    imagekit
      .upload({
        file: image,
        fileName: judul,
        tags: [category],
      })
      .then(async (response) => {
        try {
          await Products.updateOne(
            { _id: req.params.id },
            {
              $set: {
                judul,
                category,
                price,
                description,
                sertification,
                fasilitas,
                location,
                luasBangunan,
                luasTanah,
                kamarTidur,
                kamarMandi,
                lantai,
                image: response.url,
              },
            }
          );
          return res.status(200).json({
            message: "Produk berhasil diupdate",
          });
        } catch (error) {
          return res.status(500).json({
            message: error.message,
          });
        }
      })
      .catch((error) => {
        return res.status(500).json({
          message: error.message,
        });
      });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Products.findByIdAndDelete(req.params.id);
    res.status(201).json({
      message: "produk berhasil di hapus",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
