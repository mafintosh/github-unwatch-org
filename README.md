# github-unwatch-org

Unwatch all repos in a series of orgs

```
npm install -g github-unwatch-org

# make a newline delimited list of orgs you want to unwatch
echo unwatch-this-org > unwatching.txt
echo and-this-org >> unwatching.txt

# pass this file to the tool. first run will create a github token
github-unwatch-org unwatching.txt
```

## License

MIT
