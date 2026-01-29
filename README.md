# UTM Source Detector

A web tool to identify traffic sources from URLs and UTM parameters. Helps non-technical users determine where leads originate by analyzing tracking parameters and click IDs.

## Features

- Parse URLs with UTM parameters
- Detect advertising click IDs (gclid, fbclid, msclkid, etc.)
- Identify traffic sources from major platforms
- Calculate confidence scores based on available signals
- Privacy-first: all processing happens client-side

## Getting Started

```sh
npm install
npm run dev
```

Open `http://localhost:4321` in your browser.

## Build

```sh
npm run build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/name`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/name`)
5. Open a Pull Request

### Adding New Platforms

To add support for new advertising platforms or traffic sources, edit `src/data/brand-patterns.ts`. The file contains documented interfaces and examples for:

- Click ID definitions
- Brand detection patterns
- Medium type mappings
- Source name normalizations

## License

MIT
