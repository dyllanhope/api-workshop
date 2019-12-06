module.exports = (pool) => {
    const saveFavourite = async (record) => {
        let data = [
            record.username,
            record.make,
            record.model,
            record.color,
            record.price,
            record.reg_number
        ];
        let check = await pool.query('SELECT * FROM favourites WHERE reg_number = $1 AND username = $2', [record.reg_number, record.username]);
        console.log(check, 'check')
        if (check.rowCount === 0) {
            await pool.query('INSERT INTO favourites(username,make,model,color,price,reg_number) VALUES($1,$2,$3,$4,$5,$6)', data);
        }
    }
    const removeFavourite = async (reg, username) => {
        await pool.query('DELETE FROM favourites WHERE reg_number = $1 AND username = $2', [reg, username]);
        let newList = await listFavourites(username);
        return newList;
    }
    const listFavourites = async (username) => {
        let list = await pool.query('SELECT * FROM favourites WHERE username = $1', [username]);
        return list.rows;
    }

    return {
        saveFavourite,
        listFavourites,
        removeFavourite
    }
}