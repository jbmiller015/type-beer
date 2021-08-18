module.exports = {
    createModel: function (name, req) {

        switch (name) {
            case 'Brewery': {
                return {
                    name: req.body.name,
                    userId: req.user._id,
                    address: req.body.address,
                    logo_pic: req.body.logo_pic
                };
            }
            case 'Beer': {
                return {
                    name: req.body.name,
                    style: req.body.style,
                    pic: req.body.pic,
                    desc: req.body.desc,
                    userId: req.user._id
                };
            }
            case 'Tank': {
                return {
                    name: req.body.name,
                    size: req.body.size,
                    contents: req.body.contents,
                    fill: req.body.fill,
                    fillDate: req.body.fillDate,
                    currPhase: req.body.currPhase,
                    nextPhase: req.body.nextPhase,
                    currPhaseDate: req.body.currPhaseDate
                };
            }
            case 'Inventory':
                return 'Inventory'

            case 'Addition': {
                return {
                    additionType: req.body.additionType,
                    name: req.body.name,
                    quantity: req.body.quantity,
                    note: req.body.note,
                    supplier: req.body.supplier,
                    expirationDate: req.body.expirationDate,
                    userId: req.user._id
                };
            }
            case 'Hop': {
                return {
                    hopType: req.body.hopType,
                    name: req.body.name,
                    quantity: req.body.quantity,
                    note: req.body.note,
                    supplier: req.body.supplier,
                    expirationDate: req.body.expirationDate,
                    harvestDate: req.body.harvestDate,
                    alphaAcid: req.body.alphaAcid,
                    userId: req.user._id
                };
            }
            case 'MaltGrain': {
                return {
                    maltGrainType: req.body.maltGrainType,
                    name: req.body.name,
                    color: req.body.color,
                    supplier: req.body.supplier,
                    lovibond: req.body.lovibond,
                    moisturePercent: req.body.moisturePercent,
                    grainUsage: req.body.grainUsage,
                    diastaticPowderLow: req.body.diasticPowderLow,
                    diastaticPowderHigh: req.body.diasticPowderHigh,
                    quantity: req.body.quantity,
                    expirationDate: req.body.expirationDate,
                    note: req.body.note,
                    userId: req.user._id
                };
            }
            case 'Yeast': {
                return {
                    yeastType: req.body.yeastType,
                    name: req.body.name,
                    supplier: req.body.supplier,
                    characteristics: req.body.characteristics,
                    quantity: req.body.quantity,
                    pitching: req.body.pitching,
                    fermentationTempLow: req.body.fermentationTempLow,
                    fermentationTempHigh: req.body.fermentationTempHigh,
                    attenuationLow: req.body.attenuationLow,
                    attenuationHigh: req.body.attenuationHigh,
                    alcoholToleranceLow: req.body.alcoholToleranceLow,
                    alcoholToleranceHigh: req.body.alcoholToleranceHigh,
                    flocculation: req.body.flocculation,
                    userId: req.user._id
                };
            }
            default:
                return ''
        }
    }
}
