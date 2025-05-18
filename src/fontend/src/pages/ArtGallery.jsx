import { artGallery, shortenAddress } from "../api/utils";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import Card from "../components/Card";
import { Avatar, Box, Button, CardHeader, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Link } from "react-router-dom";
export default function ArtGallery({ contract, account }) {
    const [arts, setArts] = useState();
    const [filteredArts, setFilteredArts] = useState();
    const [search, setSearch] = useState();
    const [sortOption, setSortOption] = useState('none');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const tmp = await artGallery(contract);
                setArts(tmp);
                setFilteredArts(tmp);
            } catch (error) {
                alert(error.message);
            }
        }
        fetchData();
    }, []);

    const handleClick = () => {
        let res = [...arts];

        if (search) {
            res = arts.filter((art) => (
                art.tokenId === search || art.owner.toLowerCase().includes(search.toLowerCase()) || (art.name.toLowerCase().includes(search.toLowerCase()))
            ));
        }


        switch (sortOption) {
            case "price-asc":
                res.sort((a, b) => Number(a.price) - Number(b.price));
            break;
            case "price-desc":
                res.sort((a, b) => Number(b.price) - Number(a.price));
            break;
            case "name-az":
                res.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            break;
            case "name-za":
                res.sort((a, b) => -1 * a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            break;
            default:
            break;
        }
        setFilteredArts(res);
    }


    if (!arts) {
        return <Loading />;
    }

    return (
        <>
            <Box display="flex" gap={2} bgcolor="#f7f0eb" p={2}>
                <TextField
                    label="Search by Token Id/ Name/ Address"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ width: '40%'}}
                />
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Sort</InputLabel>
                    <Select
                        value={sortOption}
                        label="Sort"
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <MenuItem value="none">None</MenuItem>
                        <MenuItem value="price-asc">Price ↑</MenuItem>
                        <MenuItem value="price-desc">Price ↓</MenuItem>
                        <MenuItem value="name-az">A-Z</MenuItem>
                        <MenuItem value="name-za">Z-A</MenuItem>
                    </Select>
                </FormControl>
                <Button onClick={handleClick} sx={{
                    border: '1px solid #1976d2',
                    color: '#1976d2',
                    ml: 2
                }}>Find</Button>
            </Box>
            <Box
                minHeight="100vh"
                display="flex"
                justifyContent="center"
                alignItems="left"
                bgcolor="#f7f0eb"
                p={2}
            >
                <Box display="flex" flexWrap="wrap" gap={2}>
                    {filteredArts.map(art => (
                        <div key={art.tokenId}>
                            <Link to={`/${art.owner}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <CardHeader
                                    title={account === art.owner ? "You" : shortenAddress(art.owner)}
                                    avatar={
                                        <Avatar>
                                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDgiIHNoYXBlLXJlbmRlcmluZz0ib3B0aW1pemVTcGVlZCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0Ij48cGF0aCBmaWxsPSJoc2woMTQ1IDk0JSA1NyUpIiBkPSJNMCwwSDhWOEgweiIvPjxwYXRoIGZpbGw9ImhzbCg1MSA4MSUgMzglKSIgZD0iTTEsMGgxdjFoLTF6TTYsMGgxdjFoLTF6TTIsMGgxdjFoLTF6TTUsMGgxdjFoLTF6TTAsMWgxdjFoLTF6TTcsMWgxdjFoLTF6TTEsMWgxdjFoLTF6TTYsMWgxdjFoLTF6TTIsMWgxdjFoLTF6TTUsMWgxdjFoLTF6TTMsMWgxdjFoLTF6TTQsMWgxdjFoLTF6TTEsMmgxdjFoLTF6TTYsMmgxdjFoLTF6TTIsMmgxdjFoLTF6TTUsMmgxdjFoLTF6TTAsM2gxdjFoLTF6TTcsM2gxdjFoLTF6TTEsM2gxdjFoLTF6TTYsM2gxdjFoLTF6TTIsM2gxdjFoLTF6TTUsM2gxdjFoLTF6TTAsNGgxdjFoLTF6TTcsNGgxdjFoLTF6TTIsNGgxdjFoLTF6TTUsNGgxdjFoLTF6TTMsNGgxdjFoLTF6TTQsNGgxdjFoLTF6TTEsNWgxdjFoLTF6TTYsNWgxdjFoLTF6TTIsNWgxdjFoLTF6TTUsNWgxdjFoLTF6TTMsNWgxdjFoLTF6TTQsNWgxdjFoLTF6TTAsNmgxdjFoLTF6TTcsNmgxdjFoLTF6TTIsNmgxdjFoLTF6TTUsNmgxdjFoLTF6TTAsN2gxdjFoLTF6TTcsN2gxdjFoLTF6TTIsN2gxdjFoLTF6TTUsN2gxdjFoLTF6TTMsN2gxdjFoLTF6TTQsN2gxdjFoLTF6Ii8+PHBhdGggZmlsbD0iaHNsKDI0IDkwJSA2OSUpIiBkPSJNMywyaDF2MWgtMXpNNCwyaDF2MWgtMXpNMSw0aDF2MWgtMXpNNiw0aDF2MWgtMXoiLz48L3N2Zz4=" alt="avatar" />
                                        </Avatar>
                                    }
                                /></Link>
                            <Link to={`/nft/${art.tokenId}`} style={{ textDecoration: 'none', color: 'inherit' }}><Card key={art.tokenId} art={art} account={account} /></Link>
                        </div>
                    ))}
                </Box>
            </Box>
        </>
    );
}