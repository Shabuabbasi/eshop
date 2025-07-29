
export const getCategories = (req, res) => {
        return res.status(200).json({ success: true, categories: ['Electronics', 'Fashion', 'Books' ] });
}