'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter, usePathname } from 'next/navigation';
import SubMenu from './SubMenu'
import Link from 'next/link';
import { format } from "date-fns";
import { useEffect, useState } from 'react';
import { faChevronDown, faHeart, faPlus, faUpDown } from '@fortawesome/free-solid-svg-icons';
import { projectType } from '@/schemaValidations/project.schema';
import projectApiRequest from '@/apiRequests/project';
import AddProject from './components/AddProject';
import ListMyProject from './components/ListMyProject';
import { motion } from 'framer-motion';

interface Menu {
  label: string
  path?: string
  icon?: any // Replace 'any' with the specific type of your icon library if available
  role?: string
  submenu?: Menu[]
}

interface MenuListProps {
  menus: Menu[]
  toggle: () => void
}

const MenuList = ({ menus, toggle }: MenuListProps) => {
  const pathName = usePathname()
  const router = useRouter();
  const dateTime = new Date();
  const [showMyProjects, setShowMyProjects] = useState<boolean>(false);
  const [date, setDate] = useState<string>("");
  const [projects, setProjects] = useState<projectType[]>([])
  const [projectsFavorite, setProjectsFavorite] = useState<any[]>([])
  const [showAddProject, setShowAddMyProject] = useState<boolean>(false);

  const getProjects = async () => {
    try {
      const res = await projectApiRequest.getAll();
      setProjects(res.payload.projects.filter(project => project.favorite === 0))
      setProjectsFavorite(res.payload.projects.filter(project => project.favorite === 1));
    }
    catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    getProjects()
  }, [])


  useEffect(() => {
    if (dateTime.getDate() < 10) {
      setDate(`0${dateTime.getDate()}`);
    }
    else {
      setDate(dateTime.getDate().toString());
    }
  }, [dateTime])

  const handleMenuClick = (path: string) => {
    router.push(path);
    toggle(); // Close the menu after clicking a link
  };




  return (
    <div className='navWrapper p-4 pt-8 '>
      <ul id='menu' >
        {menus?.map((menu: Menu) => {
          const pathParts = pathName.split('/');
          const path = `/${pathParts[1]}`;
          return menu.submenu ? (
            <SubMenu key={menu.label} menu={menu} toggle={toggle} />
          ) : menu.path && menu.label === 'Today' ?
            <li key={menu.label}>
              <Link href={menu.path}
                className={`flex justify-start text-sm font-mono font-bold items-center pl-4 text-gray-500 pb-2 pt-2 cursor-pointer animate-wiggle`}
                style={
                  menu.path === path ? { backgroundColor: "rgb(187 247 208 / 1)", color: "rgb(20 83 45 / 1)", borderRadius: "7px" } : {}
                }
              >
                {menu.icon && <p className='relative'>
                  <FontAwesomeIcon icon={menu.icon} className='pr-4 text-2xl' />
                  <span className='absolute top-2 left-1 z-[999] text-white text-xs'>{date}</span>
                </p>}
                {menu.label}
              </Link>
            </li>
            : menu.path && menu.icon ?
              <li key={menu.label}>
                <Link href={menu.path}
                  className={`flex justify-start text-sm font-mono font-bold items-center pl-4 text-gray-500 pb-2 pt-2 cursor-pointer animate-wiggle`}
                  style={
                    menu.path === path ? { backgroundColor: "rgb(187 247 208 / 1)", color: "rgb(20 83 45 / 1)", borderRadius: "7px" } : {}
                  }
                >
                  {menu.icon &&
                    <FontAwesomeIcon icon={menu.icon} className='pr-4 text-2xl' />
                  }
                  {menu.label}
                </Link>
              </li>
              : ""

        }
        )}

        <ul>
          <li className='my-3 pt-[50px] flex justify-between items-center z-50'>
            <span className='text-sm font-bold uppercase text-gray-500'>
              My Projects
            </span>
            <div className='pl-4'>
              <button type="button" className=' text-center hover:bg-slate-100 rounded-full' onClick={() => setShowAddMyProject(true)}><FontAwesomeIcon icon={faPlus} className='text-[15px] text-gray-500 px-3 hover:text-green-700 ' /></button>
              <button type="button" onClick={() => setShowMyProjects(!showMyProjects)} className='text-center hover:bg-slate-100 rounded-full'><FontAwesomeIcon icon={faChevronDown} className={
                `text-[15px] text-gray-500 px-3 hover:text-green-700  transform transition-transform ${showMyProjects ? '' : '-rotate-90'}`}
              /></button>
            </div>
          </li>
          <li className='overflow-hidden'>
            <motion.div
              animate={showMyProjects ? { opacity: 1, y: 0 } : { opacity: 0, y: -200 }}
              transition={{
                duration: 0.3,
                delay: 0.4,
              }}>
              {
                <ListMyProject
                  setProjectsFavorite={setProjectsFavorite}
                  projectsFavorite={projectsFavorite}
                  pathName={pathName}
                  showMyProjects={showMyProjects}
                  favorited={true}
                />
              }
              {projectsFavorite.length > 0 && <li className={`${showMyProjects ? 'block' : 'hidden'}`}><span className='pl-4'>-----</span></li>}
              {
                <ListMyProject
                  setProjectsFavorite={setProjects}
                  projectsFavorite={projects}
                  pathName={pathName}
                  showMyProjects={showMyProjects}
                  favorited={false}
                />
              }
            </motion.div>
          </li>
        </ul>
      </ul>
      <AddProject
        open={showAddProject}
        setOpen={setShowAddMyProject}
        setProjects={setProjects}
        projects={projects}
        setProjectsFavorite={setProjectsFavorite}
        projectsFavorite={projectsFavorite}
      />
    </div >
  )
}

export default MenuList
