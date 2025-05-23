import { artGallery, shortenAddress } from "../api/utils";
import { useState, useEffect, useMemo, useCallback } from "react";
import Loading from "../components/Loading";
import Card from "../components/Card";
import {
  Avatar,
  Box,
  Button,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import { usePE } from "../hooks/usePE";

export default function ArtGallery() {
  const { contract, account } = usePE();
  const [arts, setArts] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('none');
  const [loading, setLoading] = useState(true);

  // Only fetch when contract changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await artGallery(contract);
        setArts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (contract) fetchData();
  }, [contract]);

  // Avoid unnecessary recalculations
  const filteredArts = useMemo(() => {
    let result = [...arts];

    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (art) =>
          art.tokenId === search ||
          art.owner.toLowerCase().includes(query) ||
          art.name.toLowerCase().includes(query)
      );
    }

    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "name-az":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-za":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [arts, search, sortOption]);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortOption(e.target.value);
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Box display="flex" gap={2} bgcolor="#f7f0eb" p={2}>
        <TextField
          label="Search by Token Id/ Name/ Address"
          value={search}
          onChange={handleSearchChange}
          sx={{ width: '40%' }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort</InputLabel>
          <Select
            value={sortOption}
            label="Sort"
            onChange={handleSortChange}
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="price-asc">Price ↑</MenuItem>
            <MenuItem value="price-desc">Price ↓</MenuItem>
            <MenuItem value="name-az">A-Z</MenuItem>
            <MenuItem value="name-za">Z-A</MenuItem>
          </Select>
        </FormControl>
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
          {filteredArts.map((art) => (
            <div key={art.tokenId}>
              <Link
                to={`/${art.owner}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <CardHeader
                  title={account === art.owner ? "You" : shortenAddress(art.owner)}
                  avatar={
                    <Avatar>
                      <img
                        src="data:image/jpeg;base64,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"
                        alt="avatar"
                      />
                    </Avatar>
                  }
                />
              </Link>
              <Link
                to={`/nft/${art.tokenId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card art={art} />
              </Link>
            </div>
          ))}
        </Box>
      </Box>
    </>
  );
}
