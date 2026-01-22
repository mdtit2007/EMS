export const authMe = async (req, res) => {
   try {
    const user = req.user; // lay tu authMiddlewares
    return res.status(200).json({ user });
   } catch (error) {
    console.error("Lỗi khi gọi authMe:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
   }
};