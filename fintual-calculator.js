const money = 100000;

const userDate = '01-01-2020';

const distribution = {
    risky_norris: 1,
    moderate_pitt: 0,
    conservative_clooney: 0,
    very_conservative_streep: 0
}

//======================================================================================================================================//

const getAssetValue = async ( id , date ) => {
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const resp = await fetch(`https://fintual.cl/api/real_assets/${ id }/days?from_date=${ date }&to_date=${ date }`, requestOptions);
    const data = await resp.json();

    return data.data[0].attributes.price;
 
}

const getGrowthRate = async ( userDate , currentDate , id ) => {
    
    const userDateValue = await getAssetValue( id, userDate );
    const currentDateValue = await getAssetValue( id, currentDate );

    return ((currentDateValue / userDateValue) - 1);

}

const getGrowthValue = async ( userDate , currentDate , id,  value ) => {

    const growthRate = await getGrowthRate( userDate , currentDate , id )

    return ( value * growthRate ) + value;

}

const getTotalGrowthValue = async ( userDate, distribution, value ) => {

    const fundsId = {
        risky_norris: '186',
        moderate_pitt: '187',
        conservative_clooney: '188',
        very_conservative_streep: '15077'
    }
    
    const getCurrentDate = () => {
        const systemDate = new Date();
    
        let day = systemDate.getDate();
        let month = systemDate.getMonth() + 1;
        let year = systemDate.getFullYear();
    
        return `${day}-${month}-${year}`
    }

    const divider = ( money , distribution ) => {

        const riskyNorris = money * distribution.risky_norris;
        const moderatePitt = money * distribution.moderate_pitt;
        const conservativeClooney = money * distribution.conservative_clooney;
        const veryConservativeStreep = money * distribution.very_conservative_streep;
    
    
        return {
            risky_norris: riskyNorris,
            moderate_pitt: moderatePitt,
            conservative_clooney: conservativeClooney,
            very_conservative_streep: veryConservativeStreep
        }
    
    }

    const distribuitedMoney = divider(value, distribution);

    const currentDate = getCurrentDate();

    const riskyNorrisValue = await getGrowthValue( userDate, currentDate, fundsId.risky_norris, distribuitedMoney.risky_norris );
    const moderatePittValue = await getGrowthValue ( userDate, currentDate, fundsId.moderate_pitt, distribuitedMoney.moderate_pitt);
    const conservativeClooneyValue = await getGrowthValue( userDate, currentDate, fundsId.conservative_clooney, distribuitedMoney.conservative_clooney);
    const veryConservativeStreepValue = await getGrowthValue( userDate, currentDate, fundsId.very_conservative_streep, distribuitedMoney.very_conservative_streep );

     console.log(riskyNorrisValue + moderatePittValue + conservativeClooneyValue + veryConservativeStreepValue);

}

getTotalGrowthValue(userDate, distribution, money);